
export const orderCalculateFunc = (row) => {

  // Retrieve values from input object
  const rate = Number(row.Rate) || 0;
  const quantity = Number(row.Quantity) || 0;
  const gstPercentage = Number(row.GSTPercentage) || 0;

  // Calculate basic amount
  const basicAmount = rate * quantity;

  // Calculate GST amount
  const gstAmount = (basicAmount * gstPercentage) / 100;

  // Calculate CGST and SGST amounts
  const CGST_Amount = Number((gstAmount / 2).toFixed(2));
  const SGST_Amount = CGST_Amount;

  // Calculate rounded GST amount
  const roundedGstAmount = CGST_Amount + SGST_Amount;

  // Calculate total amount
  const totalAmount = gstAmount + basicAmount;

  return {
    basicAmount: basicAmount.toFixed(2),
    roundedTotalAmount: totalAmount.toFixed(2),
    CGST_Amount: CGST_Amount.toFixed(2),
    SGST_Amount: SGST_Amount.toFixed(2),
    roundedGstAmount: roundedGstAmount.toFixed(2),
  };
};
