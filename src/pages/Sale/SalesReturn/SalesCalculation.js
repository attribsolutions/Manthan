
export const calculateSalesReturnFunc = (row) => {
    
    let rate = 0;
    let quantity = 0;
    let gstPercentage = 0;

    if (row.rate !== '') {
        rate = parseFloat(row.rate);
    }

    if (row.quantity !== '') {
        quantity = parseFloat(row.quantity);
    }

    let basicAmount = rate * quantity;
    if (isNaN(basicAmount)) {
        basicAmount = 0;
    }

    if (row.gstPercentage !== '') {
        gstPercentage = parseFloat(row.gstPercentage);
    }

    let gstAmount = (basicAmount * gstPercentage) / 100;
    const totalAmount = gstAmount + basicAmount;
    const CGST_Amount = (gstAmount / 2).toFixed(2);
    const SGST_Amount = CGST_Amount;
    const roundedGstAmount = gstAmount.toFixed(2);
    const roundedTotalAmount = totalAmount.toFixed(2);

    return {
        basicAmount,
        roundedGstAmount,
        roundedTotalAmount,
        CGST_Amount,
        SGST_Amount,
    };
};

export const return_discountCalculate_Func = (row,) => {
    
    // Extract values from the input parameters
    const rate = Number(row.Rate) || 0;
    const qty = Number(row.Quantity) || 0;
    const gstPercentage = Number(row.GSTPercentage) || 0;
    const discount = Number(row.Discount) || 0;
    const discountType = Number(row.DiscountType) && Number(row.DiscountType) > 0 ? Number(row.DiscountType) : 2;

    // Calculate the base amount
    const basicAmount = rate * qty;

    // Calculate the discount amount based on the discount type
    const disCountAmt = discountType === 2 ? basicAmount - (basicAmount / ((100 + discount) / 100)) : qty * discount;

    // Calculate the discounted base amount
    const discountBaseAmt = basicAmount - disCountAmt;

    // Calculate the GST amount
    let gstAmt = discountBaseAmt * (gstPercentage / 100);
    let CGST_Amount = Number((gstAmt / 2).toFixed(2));
    let SGST_Amount = CGST_Amount;
    let IGST_Amount = 0 //initial GST Amount 

    // Calculate the total amount after discount and GST
    const roundedGstAmount = CGST_Amount + SGST_Amount;
    let total = roundedGstAmount + discountBaseAmt;

    let GST_Percentage = Number(row.GSTPercentage) || 0;
    let IGST_Percentage = 0;
    let SGST_Percentage = (GST_Percentage / 2);
    let CGST_Percentage = (GST_Percentage / 2);

    
    // Return the calculated values as an object
    return {
        discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
        disCountAmt: Number(disCountAmt.toFixed(2)),
        roundedGstAmount: Number(roundedGstAmount.toFixed(2)),
        roundedTotalAmount: Number(total.toFixed(2)),
        CGST_Amount,
        SGST_Amount,
        IGST_Amount,
        GST_Percentage: GST_Percentage.toFixed(2),
        CGST_Percentage: CGST_Percentage.toFixed(2),
        SGST_Percentage: SGST_Percentage.toFixed(2),
        IGST_Percentage: IGST_Percentage.toFixed(2),
        discount,
        discountType
    };
};

