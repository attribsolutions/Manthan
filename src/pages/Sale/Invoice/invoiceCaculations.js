import { amountCommaSeparateFunc, CommonConsole, groupBy, loginSystemSetting } from "../../../components/Common/CommonFunction"


export function bulkSearch(text, data, columns) {

    let search = text.toLowerCase()

    const filter = data.filter((item) => {
        let found = false

        if (item.header) { return true }

        for (let i = 0; i < columns.length; i++) {

            let isCell = item[columns[i].dataField]
            if (!(isCell === null)
                && !(isCell === undefined)
                && typeof isCell !== 'object'
                && !Array.isArray(isCell)
            ) {
                if (!found) {
                    isCell = JSON.stringify(isCell);
                    isCell = isCell.toLowerCase(isCell)
                    found = isCell.includes(search);
                }
            }
        }
        return found

    })
    let hasHedRow1 = []
    const grouped = groupBy(filter, pet => pet.Party);
    grouped.forEach(i => {
        if (i.length > 1) {
            i.forEach(k => {
                hasHedRow1.push(k)
            })
        }
    })
    return hasHedRow1
}


export const invoice_discountCalculate_Func = (row, index1) => {

    // Extract values from the input parameters
    const rate = Number(row.Rate) || 0;
    const qty = Number(row.Qty) || 0;
    const gstPercentage = Number(row.GST) || 0;
    const discount = Number(index1.Discount) || 0;
    const discountType = index1.DiscountType || 2;

    // Calculate the base amount
    const basicAmount = rate * qty;

    // Calculate the discount amount based on the discount type
    const disCountAmt = discountType === 2 ? basicAmount - (basicAmount / ((100 + discount) / 100)) : qty * discount;

    // Calculate the discounted base amount
    const discountBaseAmt = basicAmount - disCountAmt;

    // Calculate the GST amount
    let gstAmt = discountBaseAmt * (gstPercentage / 100);
    const CGST_Amount = Number((gstAmt / 2).toFixed(2));
    const SGST_Amount = CGST_Amount;
    const roundedGstAmount = CGST_Amount + SGST_Amount;

    // Calculate the total amount after discount and GST
    let total = roundedGstAmount + discountBaseAmt;

    // Return the calculated values as an object
    return {
        discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
        disCountAmt: Number(disCountAmt.toFixed(2)),
        roundedGstAmount: Number(roundedGstAmount.toFixed(2)),
        roundedTotalAmount: Number(total.toFixed(2)),
        CGST_Amount,
        SGST_Amount,
    };
};


export const settingBaseRoundOffAmountFunc = (tableList = []) => {

    // Get the system settings
    const systemSetting = loginSystemSetting();
    const isGrandAmtRound = systemSetting.InvoiceAmountRoundConfiguration === '1';
    const isTCS_AmtRound = systemSetting.TCSAmountRoundConfiguration === '1';

    // Calculate the sum of the roundedTotalAmount in the tableList
    let sumOfGrandTotal = tableList.reduce((accumulator, currentObject) => accumulator + Number(currentObject["roundedTotalAmount"]) || 0, 0);
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
        RoundOffAmount: (sumOfGrandTotal - Math.trunc(sumOfGrandTotal)).toFixed(2), // Calculate the round-off amount
        TCS_Amount: isTCS_AmtRound ? Math.round(TCS_Amount) : Number(TCS_Amount).toFixed(2) // Round off or format the TCS Amount
    };
};


export function stockDistributeFunc(index1) {

    let roundedTotalAmount = 0
    let orderqty = Number(index1.Quantity);
    let _ItemTotalStock = 0

    index1.StockDetails = index1.StockDetails.map(index2 => {

        let stockqty = Number(index2.ActualQuantity);

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

            const calculate = invoice_discountCalculate_Func(index2, index1)
            roundedTotalAmount = roundedTotalAmount + Number(calculate.roundedTotalAmount)
        }

        try {
            document.getElementById(`batchQty${index1.id}-${index2.id}`).value = index2.Qty

        } catch (e) { CommonConsole('stockDistributeFunc', e) }



        return index2
    });

    index1.ItemTotalStock = _ItemTotalStock;

    const t2 = index1.ItemTotalStock;
    const tA4 = roundedTotalAmount.toFixed(2);

    index1.roundedTotalAmount = tA4

    if (orderqty > t2) {
        try {
            document.getElementById(`OrderQty${index1.id}`).value = t2.toFixed(3)
        } catch (e) { CommonConsole('stockDistributeFunc', e) }
    };
    try {
        index1.StockInValid = false
        index1.StockInvalidMsg = null
        document.getElementById(`StockInvalidMsg-${index1.id}`).style.display = "none";
    } catch (e) { CommonConsole('stockDistributeFunc ', e) };

    try {
        document.getElementById(`roundedTotalAmount-${index1.id}`).innerText = tA4;
    } catch (e) { CommonConsole('stockDistributeFunc', e) };

};


export function orderQtyOnChange(event, index) {

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

    stockDistributeFunc(index)
};


export function orderQtyUnit_SelectOnchange(event, index1) {

    index1.default_UnitDropvalue = event;
    index1.ConversionUnit = event.ConversionUnit;

    index1.StockDetails.forEach(index2 => {
        index2.Rate = ((event.BaseUnitQuantity / event.BaseUnitQuantityNoUnit) * index2.initialRate).toFixed(2);
        index2.ActualQuantity = (index2.BaseUnitQuantity / event.BaseUnitQuantity).toFixed(3);

        document.getElementById(`stockItemRate-${index1.id}-${index2.id}`).innerText = amountCommaSeparateFunc(index2.Rate);
        document.getElementById(`ActualQuantity-${index1.id}-${index2.id}`).innerText = index2.ActualQuantity;

    })

    stockDistributeFunc(index1)
};


export function stockQtyOnChange(event, index1, index2) {

    let input = Number(event.target.value)
    let result = /^\d*(\.\d{0,3})?$/.test(input);
    let actualQuantity = Number(index2.ActualQuantity)

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

    innerStockCaculation(index1)

};


export const innerStockCaculation = (index1) => {

    let QuantityTatal = 0
    let roundedTotalAmount = 0;

    index1.StockDetails.forEach(index2 => {
        //**discount calculation function  */
        const calculate = invoice_discountCalculate_Func(index2, index1);

        roundedTotalAmount = roundedTotalAmount + Number(calculate.roundedTotalAmount)
        QuantityTatal = Number(QuantityTatal) + Number(index2.Qty);
    });

    index1.roundedTotalAmount = roundedTotalAmount.toFixed(2)
    index1.Quantity = QuantityTatal.toFixed(3);

    try {
        document.getElementById(`OrderQty-${index1.id}`).value = index1.Quantity
    } catch (e) { CommonConsole('innerStockCaculation', e) };

    try {
        document.getElementById(`roundedTotalAmount-${index1.id}`).innerText = index1.roundedTotalAmount;
    } catch (e) { CommonConsole('innerStockCaculation', e) };

}

