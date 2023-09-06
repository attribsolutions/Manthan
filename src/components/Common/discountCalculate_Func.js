export const withStock_discountCalculate_Func = (row, index1, IsComparGstIn) => {
    
    // Extract values from the input parameters
    const rate = Number(row.Rate) || 0;
    const quantity = Number(row.Quantity) || 0;
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