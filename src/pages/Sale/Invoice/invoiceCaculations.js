import { amountCommaSeparateFunc, CommonConsole, compareGSTINState, hasDecimalCheckFunc, loginSystemSetting, roundToDecimalPlaces } from "../../../components/Common/CommonFunction"
import { decimalRegx_3dit, onlyNumberRegx } from "../../../CustomValidateForm";


export const invoice_discountCalculate_Func = (row, index1, IsComparGstIn) => {

    // Extract values from the input parameters
    const rate = Number(row.Rate) || 0;
    const quantity = Number(row.Qty) || 0;
    const gstPercentage = Number(row.GST) || 0;
    const discount = Number(index1.Discount) || 0;
    const discountType = Number(index1.DiscountType) || 2;

    // Calculate the base amount
    const basicAmount = rate * quantity;

    // Calculate the discount amount based on the discount type
    const disCountAmt = discountType === 2 ? basicAmount - (basicAmount / ((100 + discount) / 100)) : quantity * discount;

    // Calculate the discounted base amount
    const discountBaseAmt = basicAmount - disCountAmt;

    // Calculate the GST amount
    let gstAmt = discountBaseAmt * (gstPercentage / 100);
    let CGST_Amount = Number((gstAmt / 2).toFixed(2));
    let SGST_Amount = CGST_Amount;
    let IGST_Amount = 0 //initial GST Amount 

    // Calculate the total amount after discount and GST
    const roundedGstAmount = CGST_Amount + SGST_Amount;
    let totalAmount = roundedGstAmount + discountBaseAmt;

    let GST_Percentage = Number(index1.GSTPercentage) || 0;
    let IGST_Percentage = 0;
    let SGST_Percentage = (GST_Percentage / 2);
    let CGST_Percentage = (GST_Percentage / 2);

    if (IsComparGstIn) {  //compare Supplier and Customer are Same State by GSTIn Number
        let isSameSate = compareGSTINState(IsComparGstIn.GSTIn_1, IsComparGstIn.GSTIn_2)
        if (isSameSate) {// iF isSameSate = true ===not same GSTIn
            CGST_Amount = 0;
            SGST_Amount = 0;
            IGST_Amount = Number(roundedGstAmount.toFixed(2))
            IGST_Percentage = GST_Percentage;
            SGST_Percentage = 0;
            CGST_Percentage = 0;
        }
    }
    // Return the calculated values as an object
    return {
        discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
        disCountAmt: Number(disCountAmt.toFixed(2)),
        roundedGstAmount: Number(roundedGstAmount.toFixed(2)),
        roundedTotalAmount: Number(totalAmount.toFixed(2)),
        CGST_Amount,
        SGST_Amount,
        IGST_Amount,
        GST_Percentage: GST_Percentage.toFixed(2),
        CGST_Percentage: CGST_Percentage.toFixed(2),
        SGST_Percentage: SGST_Percentage.toFixed(2),
        IGST_Percentage: IGST_Percentage.toFixed(2),
    };
};
// ************************************************************************

export const settingBaseRoundOffAmountFunc = (tableList = []) => {
    // Get the system settings
    const systemSetting = loginSystemSetting();
    const isGrandAmtRound = systemSetting.InvoiceAmountRoundConfiguration === '1';
    const isTCS_AmtRound = systemSetting.TCSAmountRoundConfiguration === '1';

    // Calculate the sum of the item TotalAmount in the tableList
    let sumOfGrandTotal = tableList.reduce((accumulator, index1) => {
        return accumulator + Number(index1.ItemTotalAmount) || 0
    }, 0);


    let TCS_Amount = 0; // Initial TCS Amount

    if (tableList[0].IsTCSParty) {
        // Calculate TCS tax only if IsTCSParty flag is true
        if (tableList[0].IsCustomerPAN) {
            // Calculate TCS for validated PAN customer (IsCustomerPAN has value true)
            TCS_Amount = sumOfGrandTotal * (Number(systemSetting.IsTCSPercentageforValidatedPANCustomer) / 100);
            sumOfGrandTotal += TCS_Amount;
        } else {
            // Calculate TCS for non-validated PAN customer
            TCS_Amount = sumOfGrandTotal * (Number(systemSetting.IsTCSPercentageforNonValidatedPANCustomer) / 100);
            sumOfGrandTotal += TCS_Amount;
        }
    }

    return {
        sumOfGrandTotal: isGrandAmtRound ? Math.round(sumOfGrandTotal) : Number(sumOfGrandTotal).toFixed(2), // Round off or format the sumOfGrandTotal
        RoundOffAmount: (Math.round(sumOfGrandTotal) - sumOfGrandTotal).toFixed(2),// Calculate the round-off amount
        TCS_Amount: isTCS_AmtRound ? Math.round(TCS_Amount) : Number(TCS_Amount).toFixed(2),// Round off or format the TCS Amount
    };
};

// ************************************************************************
export function stockDistributeFunc(index1) {
    let totalAmount = 0;
    let remainingOrderQty = parseFloat(index1.Quantity); // Convert to a number
    let totalStockQty = 0;



    index1.StockDetails = index1.StockDetails.map(index2 => {
        const stockQty = parseFloat(index2.ActualQuantity); // Convert to a number
        totalStockQty += stockQty;

        const qtyToDeduct = Math.min(remainingOrderQty, stockQty);
        index2.Qty = roundToDecimalPlaces(qtyToDeduct, 3); // Round to three decimal places
        remainingOrderQty = roundToDecimalPlaces((remainingOrderQty - qtyToDeduct), 3); // Round the remaining order quantity

        if (qtyToDeduct > 0) {
            const calculatedItem = invoice_discountCalculate_Func(index2, index1);
            totalAmount += parseFloat(calculatedItem.roundedTotalAmount); // Convert to a number
        }

        try {
            const batchQtyElement = document.getElementById(`batchQty${index1.id}-${index2.id}`);
            batchQtyElement.value = index2.Qty; // Display with three decimal places
        } catch (error) {
            CommonConsole('stockDistributeFunc', error);
        }

        return index2;
    });



    index1.ItemTotalStock = parseFloat(totalStockQty.toFixed(3)); // Convert to a number with three decimal places
    index1.ItemTotalAmount = parseFloat(totalAmount.toFixed(2)); // Convert to a number with two decimal places

    const isUnitIs_NO = hasCheckUnitIs_NOFunc(index1);
    const isQuantityDecimal = hasDecimalCheckFunc(index1.Quantity)



    if (remainingOrderQty > 0) {

        const difference = Math.abs(index1.Quantity - index1.ItemTotalStock);//calculate short stock quantity
        index1.StockInValid = true;
        index1.StockInvalidMsg = `Short Stock Quantity ${difference.toFixed(3)}`;
        stockValidation_DOM_MsgShowFunc(index1)
    }
    else if (isUnitIs_NO && isQuantityDecimal) {

        index1.StockInValid = true;
        index1.StockInvalidMsg = "Stock quantity decimal not allowed.";
        stockValidation_DOM_MsgShowFunc(index1)

    }
    else {

        index1.StockInValid = false;
        index1.StockInvalidMsg = null;
        stockValidation_DOM_MsgShowFunc(index1)


    }

}

export function orderQtyOnChange(event, index1) {

    const hasUnit_NO = hasCheckUnitIs_NOFunc(index1);
    const totalStock = parseFloat(index1.ItemTotalStock); // Convert to a number
    const priviosValue = index1.Quantity;

    let inputValue = event.target.value;
    if (inputValue === '') { }
    else if (hasUnit_NO) {
        if (onlyNumberRegx.test(inputValue)) {
            if (totalStock < inputValue) {
                inputValue = Math.floor(totalStock).toString(); // Show stock quantity without decimals
            }
        } else {
            inputValue = Number(priviosValue).toFixed(0) || ''
        }
    } else {
        if (decimalRegx_3dit.test(inputValue)) {
            if (totalStock < inputValue) {
                inputValue = roundToDecimalPlaces(totalStock, 3); // Show stock quantity with up to 3 decimals
            }
        } else {
            inputValue = priviosValue
        }
    }

    event.target.value = inputValue;
    index1.Quantity = inputValue
    stockDistributeFunc(index1)
}
// ************************************************************************

export function orderQtyUnit_SelectOnchange(event, index1) {
    index1.default_UnitDropvalue = event;
    index1.ConversionUnit = event.ConversionUnit;

    index1.StockDetails.forEach(index2 => {
        const _hasRate = ((event.BaseUnitQuantity / event.BaseUnitQuantityNoUnit) * index2.initialRate);
        const _hasActualQuantity = (index2.BaseUnitQuantity / event.BaseUnitQuantity);
        index2.Rate = roundToDecimalPlaces(_hasRate, 2);//max 2 decimal 
        index2.ActualQuantity = roundToDecimalPlaces(_hasActualQuantity, 3);//max 3 decimal 

        document.getElementById(`stockItemRate-${index1.id}-${index2.id}`).innerText = amountCommaSeparateFunc(index2.Rate);
        document.getElementById(`ActualQuantity-${index1.id}-${index2.id}`).innerText = index2.ActualQuantity;

    })

    stockDistributeFunc(index1);
};

// ************************************************************************

export function stockQtyOnChange(event, index1, index2) {
    const hasUnit_NO = hasCheckUnitIs_NOFunc(index1);
    const totalStock = parseFloat(index2.ActualQuantity); // Convert to a number
    const priviosValue = index2.Qty;

    let inputValue = event.target.value;
    if (inputValue === '') { }
    else if (hasUnit_NO) {
        if (onlyNumberRegx.test(inputValue)) {
            if (totalStock < inputValue) {
                inputValue = Math.floor(totalStock).toString(); // Show stock quantity without decimals
            }
        } else {
            inputValue = roundToDecimalPlaces(priviosValue, 0)
        }
    } else {

        if (decimalRegx_3dit.test(inputValue)) {
            if (totalStock < inputValue) {
                inputValue = roundToDecimalPlaces(totalStock, 3); // Show stock quantity with up to 3 decimals
            }
        } else {
            inputValue = priviosValue
        }
    }

    event.target.value = inputValue;
    index2.Qty = inputValue
    innerStockCaculation(index1)

}



//     let input = Number(event.target.value)
//     let result = /^\d*(\.\d{0,3})?$/.test(input);
//     let actualQuantity = Number(index2.ActualQuantity)

//     if (result) {
//         if (!(actualQuantity >= input)) {
//             input = actualQuantity
//         };

//     } else if (((index2.Qty >= 0) && (!(input === '')))) {
//         input = index2.Qty
//     } else {
//         input = 0
//     }

//     event.target.value = input;
//     index2.Qty = input

//     innerStockCaculation(index1)

// };

// ************************************************************************

export const innerStockCaculation = (index1) => {

    let QuantityTatal = 0
    let totalAmount = 0;

    index1.StockDetails.forEach(index2 => {
        if (Number(index2.Qty) > 0) {
            const calculate = invoice_discountCalculate_Func(index2, index1);
            totalAmount += Number(calculate.roundedTotalAmount);
            QuantityTatal += Number(index2.Qty);
        }
    });


    index1.ItemTotalAmount = roundToDecimalPlaces(totalAmount, 2); //max 2 decimal
    index1.Quantity = roundToDecimalPlaces(QuantityTatal, 3); //max 3 decimal

    try {
        document.getElementById(`OrderQty-${index1.id}`).value = index1.Quantity
    } catch (e) { CommonConsole('inner-Stock-Caculation', e) };

    try {
        document.getElementById(`item-TotalAmount-${index1.id}`).innerText = amountCommaSeparateFunc(index1.ItemTotalAmount);
    } catch (e) { CommonConsole('inner-Stock-Caculation', e) };
}

// Define a function to round numbers to a specified number of decimal places

// function roundToDecimalPlaces(number, decimalPlaces) {
//     if (isNaN(number) || typeof number !== "number" || number === "" || number === null) {
//         return "";
//     }
//     const multiplier = Math.pow(10, decimalPlaces);
//     return Math.round(number * multiplier) / multiplier;
// }



function hasCheckUnitIs_NOFunc(index1) {
    return index1.default_UnitDropvalue?.Unitlabel === "No";
}

function stockValidation_DOM_MsgShowFunc(index1) {
    try {
        const hasInValid = index1.StockInValid;

        const orderQtyElement = document.getElementById(`OrderQty-${index1.id}`);
        if (orderQtyElement) {
            orderQtyElement.style.border = hasInValid ? "2px solid red" : "1px solid #ced4da";
        }
        const stockInvalidMsgElement = document.getElementById(`StockInvalidMsg-${index1.id}`);
        if (stockInvalidMsgElement) {
            stockInvalidMsgElement.style.display = hasInValid ? "block" : "none";

        }
    } catch (error) {
        CommonConsole('stockDistributeFunc', error);
    }
    //***************************************************************************************** */
    try {
        const itemTotalAmountElement = document.getElementById(`item-TotalAmount-${index1.id}`);
        itemTotalAmountElement.innerText = amountCommaSeparateFunc(index1.ItemTotalAmount);
    } catch (error) {
        CommonConsole('stockDistributeFunc', error);
    }
}
