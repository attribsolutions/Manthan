import { amountCommaSeparateFunc, CommonConsole, compareGSTINState, loginUserName, roundToDecimalPlaces } from "../../../components/Common/CommonFunction";
import { decimalRegx_3dit, onlyNumberRegx } from "../../../CustomValidateForm";
import SERVER_HOST_PATH from "../../../helpers/_serverPath";
import { FRANCHAISE_INVOICE_SAVE_API } from "../../../helpers/url_helper";

export const postWithBasicAuth = async ({ jsonBody, btnId }) => { //+++++++++++++++++++++ Session Company Id+++++++++++++++++++++++++++++
    debugger
    const username = loginUserName();
    const password = localStorage.getItem("Password");
    const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", authHeader);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(jsonBody), // Convert the body to JSON string
        redirect: "follow"
    };

    try {
        const Response = await fetch(`${SERVER_HOST_PATH}${FRANCHAISE_INVOICE_SAVE_API}`, requestOptions)
        const jsonData = await Response.json();
        jsonData["saveAndDownloadPdfMode"] = btnId === "print" ? true : false;
        jsonData["TransactionID"] = jsonData.TransactionID[0];
        return jsonData
    } catch (error) {
        console.error("Error in POST request:", error);
        throw error;
    }

};


export function orderQtyOnChange(event, index1, subPageMode) {

    const hasUnit_NO = hasCheckUnitIs_NOFunc(index1);
    const totalStock = parseFloat(index1.ItemTotalStock); // Convert to a number
    const priviosValue = index1.Quantity;

    let inputValue = event.target.value;
    if (inputValue === '') { }
    else if (hasUnit_NO) {
        if (onlyNumberRegx.test(inputValue)) {
            // if (totalStock < inputValue) {
            //     inputValue = Math.floor(totalStock).toString(); // Show stock quantity without decimals
            // }
        } else {
            inputValue = Number(priviosValue).toFixed(0) || ''
        }
    } else {
        if (decimalRegx_3dit.test(inputValue)) {
            // if (totalStock < inputValue) {
            //     inputValue = roundToDecimalPlaces(totalStock, 3); // Show stock quantity with up to 3 decimals
            // }
        } else {
            inputValue = priviosValue
        }
    }

    event.target.value = inputValue;
    index1.Quantity = inputValue
    index1.StockDetails.forEach(index2 => {
        index2.Qty = inputValue
        Franchies_invoice_Calculate_Func(index2, index1);
    })
}


export function orderQtyUnit_SelectOnchange(event, index1, subPageMode) {

    index1.default_UnitDropvalue = event;
    index1.ConversionUnit = event.ConversionUnit;

    index1.StockDetails.forEach(index2 => {

        const _hasRate = ((event.BaseUnitQuantity / event.BaseUnitQuantityNoUnit) * index1.Rate);
        index2.Rate = roundToDecimalPlaces(_hasRate, 2);//max 2 decimal 
        document.getElementById(`stockItemRate-${index1.id}`).innerText = amountCommaSeparateFunc(index2.Rate);
        Franchies_invoice_Calculate_Func(index2, index1);
    })
};


export function RoundCalculationFunc(data) {
    debugger
    const totalAmount = data.reduce((sum, item) => sum + item.Amount, 0).toFixed(2); // Ensure 2 decimal places
    const DiscountTotalAmount = data.reduce((sum, item) => sum + parseFloat(item.DiscountAmount || 0), 0).toFixed(2); // Convert string to number and sum
    const NetAmount = (totalAmount - DiscountTotalAmount).toFixed(2); // Subtract and ensure 2 decimal places
    const RoundedAmount = Math.round(NetAmount); // Nearest integer
    const RoundOffAmount = (NetAmount - RoundedAmount).toFixed(2); // Difference rounded to 2 decimal places

    return {
        "DiscountAmount": DiscountTotalAmount,
        "TotalAmount": totalAmount,
        "NetAmount": NetAmount,
        "RoundedAmount": RoundedAmount,
        "RoundOffAmount": RoundOffAmount,
    }
}

export const innerStockCaculationForFranchies = (index1) => {

    let totalAmount = 0;

    index1.StockDetails.forEach(index2 => {
        if (Number(index2.Qty) > 0) {
            const calculate = Franchies_invoice_Calculate_Func(index2, index1);
            totalAmount += Number(calculate.ItemTotalAmount);
        }
    });

    index1.ItemTotalAmount = roundToDecimalPlaces(totalAmount, 2); //max 2 decimal

    try {
        document.getElementById(`item-TotalAmount-${index1.id}`).innerText = amountCommaSeparateFunc(index1.ItemTotalAmount);
    } catch (e) { CommonConsole('inner-Stock-Caculation', e) };
}


export const Franchies_invoice_Calculate_Func = (row, index1, IsComparGstIn) => {

    const rate = Number(row.Rate) || 0;
    const mrp = Number(row.MRP) || 0;
    const quantity = Number(row.Qty) || 0;
    const gstPercentage = Number(row.GST) || 0;
    const discount = Number(index1.Discount) || 0;
    const discountType = Number(index1.DiscountType) || 2;
    const GST_Percentage = Number(index1.GSTPercentage) || 0;
    const SGST_Percentage = GST_Percentage / 2;
    const CGST_Percentage = SGST_Percentage;
    let IGST_Percentage = 0;
    debugger
    //iscounted amounts
    const basicAmount = mrp * quantity; // Total price without any discount

    // Calculate the discount amount 
    const discountAmount = discountType === 2
        ? (mrp * discount / 100) * quantity  // Percentage discount
        : discount * quantity;               // Fixed discount

    // Calculate the discounted total amount
    const discountedAmount = basicAmount - discountAmount;

    const TotalBasic = basicAmount - (basicAmount * (gstPercentage / 100))

    // Taxable and GST amounts
    // const taxableAmount = rate * quantity;
    // const discountBaseAmt = basicAmount - discountedAmount;

    const gstAmt = basicAmount * (gstPercentage / 100);
    const CGST_Amount = Number((gstAmt / 2).toFixed(2));
    const SGST_Amount = CGST_Amount;
    let IGST_Amount = 0;

    // Adjust GST based on state comparison
    if (IsComparGstIn && compareGSTINState(IsComparGstIn.GSTIn_1, IsComparGstIn.GSTIn_2)) {
        IGST_Percentage = GST_Percentage; // Full GST applies as IGST
        CGST_Percentage = 0;
        SGST_Percentage = 0;
    }

    // Total amounts
    const roundedGstAmount = CGST_Amount + SGST_Amount;
    // const totalAmount = roundedGstAmount + taxableAmount;

    index1.ItemTotalAmount = Number(discountedAmount.toFixed(2));

    // Return calculated values
    return {
        // discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
        disCountAmt: Number(discountAmount.toFixed(2)),
        ItemTotalAmount: discountedAmount,
        roundedGstAmount: Number(roundedGstAmount.toFixed(2)),
        roundedTotalAmount: Number(basicAmount.toFixed(2)),
        taxableAmount: Number(TotalBasic.toFixed(2)),
        CGST_Amount,
        SGST_Amount,
        IGST_Amount,
        GST_Percentage: GST_Percentage.toFixed(2),
        CGST_Percentage: CGST_Percentage.toFixed(2),
        SGST_Percentage: SGST_Percentage.toFixed(2),
        IGST_Percentage: IGST_Percentage.toFixed(2),
    };

};

function hasCheckUnitIs_NOFunc(index1) {
    return index1.default_UnitDropvalue?.Unitlabel === "No";
}