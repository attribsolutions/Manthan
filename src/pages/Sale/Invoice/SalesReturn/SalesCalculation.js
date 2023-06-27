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
