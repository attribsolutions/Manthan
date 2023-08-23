import { amountCommaSeparateFunc, CommonConsole, compareGSTINState } from "../../../components/Common/CommonFunction";


export const return_discountCalculate_Func = (row, index1, IsComparGstIn) => {

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

export function stockDistributeFunc(index1, _key) {

    let itemTotalAmount = 0
    let orderqty = Number(index1.Quantity);
    let _ItemTotalStock = 0

    index1.StockDetails = index1.StockDetails.map(index2 => {

        let stockqty = Number(index2.BaseUnitQuantity);

        _ItemTotalStock = _ItemTotalStock + stockqty// addition of total index2.ActualQuantity

        if ((orderqty > stockqty) && !(orderqty === 0)) {
            orderqty = orderqty - stockqty
            index2.Qty = stockqty.toFixed(3)
        } else if ((orderqty <= stockqty) && (orderqty > 0)) {
            index2.Qty = orderqty.toFixed(3)
            orderqty = 0
        }
        else {
            index2.Qty = 0;
        }

        if (index2.Qty > 0) {
            const calculate = return_discountCalculate_Func(index2, index1)
            itemTotalAmount = itemTotalAmount + Number(calculate.roundedTotalAmount)
        }

        try {
            document.getElementById(`batchQty${index1.id}-${index2.id}-${_key}`).value = Number(index2.Qty)
        } catch (e) { CommonConsole('stockDistributeFunc', e) }

        return index2
    });

    index1.ItemTotalStock = _ItemTotalStock;

    const t2 = index1.ItemTotalStock;
    const tA4 = itemTotalAmount.toFixed(2);

    index1.itemTotalAmount = tA4

    if (orderqty > t2) {
        try {
            document.getElementById(`returnQty-${index1.id}-${_key}`).value = t2.toFixed(3)
        } catch (e) { CommonConsole('stockDistributeFunc', e) }
    };
    try {
        index1.StockInValid = false
        index1.StockInvalidMsg = null
        document.getElementById(`StockInvalidMsg-${index1.id}`).style.display = "none";
    } catch (e) { CommonConsole('stockDistributeFunc ', e) };

    try {
        document.getElementById(`itemTotalAmount-${index1.id}-${_key}`).innerText = amountCommaSeparateFunc(tA4);
    } catch (e) { CommonConsole('stockDistributeFunc', e) };

};

// ************************************************************************

export function returnQtyOnChange(event, index, _key) {

    let input = Number(event.target.value)
    let ItemTotalStock = Number(index.ItemTotalStock)
    let result = /^\d*(\.\d{0,3})?$/.test(input);

    if (result) {
        if (!(ItemTotalStock >= input)) {
            input = ItemTotalStock
        };

    } else if (((index.Quantity >= 0) && (!(input === '')))) {
        input = index.Quantity
    } else {
        input = 0
    }

    event.target.value = input;
    index.Quantity = input

    stockDistributeFunc(index, _key)
};

// ************************************************************************

export function stockQtyOnChange(event, index1, index2, _key) {

    let input = Number(event.target.value)
    let result = /^\d*(\.\d{0,3})?$/.test(input);
    let actualQuantity = Number(index2.BaseUnitQuantity)

    if (result) {
        if (!(actualQuantity >= input)) {
            input = actualQuantity
        };

    } else if (((index2.Qty >= 0) && (!(input === '')))) {
        input = index2.Qty
    } else {
        input = 0
    }

    event.target.value = input;
    index2.Qty = input

    innerStockCaculation(index1, _key)

};

// ************************************************************************
export const innerStockCaculation = (index1, _key) => {

    let QuantityTatal = 0
    let itemTotalAmount = 0;

    index1.StockDetails.forEach(index2 => {
        if (Number(index2.Qty) > 0) {
            const calculate = return_discountCalculate_Func(index2, index1);
            itemTotalAmount += Number(calculate.roundedTotalAmount);
            QuantityTatal += Number(index2.Qty);
        }
    });

    index1.itemTotalAmount = itemTotalAmount.toFixed(2)
    index1.Quantity = QuantityTatal.toFixed(3);

    try {
        document.getElementById(`returnQty-${index1.id}-${_key}`).value = Number(index1.Quantity)
    } catch (e) { CommonConsole('innerStockCaculation', e) };

    try {
        document.getElementById(`itemTotalAmount-${index1.id}-${_key}`).innerText = amountCommaSeparateFunc(index1.itemTotalAmount);
    } catch (e) { CommonConsole('innerStockCaculation', e) };

}