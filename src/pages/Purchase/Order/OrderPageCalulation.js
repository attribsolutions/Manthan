

// export const basicAmount = i => {

//     let rate = 0
//     let qty = 0
//     if (!(i.Rate == '')) { rate = i.Rate; };
//     if (!(i.Quantity == '')) { qty = i.Quantity; };

//     let val = parseFloat(rate) * parseFloat(qty)
//     if (!val) {
//         val = 0
//     }

//     return val
// }

// export const roundedGstAmount = (i) => {
//     let rowGst = 0
//     let qty = 0
//     if (!(i.GSTPercentage == '')) { rowGst = i.GSTPercentage; };
//     const base = basicAmount(i);
//     const gst = parseFloat(rowGst);
//     return ((base * gst) / 100)
// }

// export const Amount = (i) => {

//     const roundedGstAmount = roundedGstAmount(i);
//     const basicAmount = basicAmount(i);
//     const total = roundedGstAmount + parseFloat(basicAmount)
//     return total.toFixed(2)
// }





// export const Y = (i) => {
//     // Retrieve values from input object
//     const rate = Number(i.Rate) || 0;
//     const qty = Number(i.Quantity) || 0;
//     const rowGst = Number(i.GSTPercentage) || 0;

//     // Calculate basic amount
//     const basicAmount = rate * qty;

//     // Calculate rounded GST amount
//     const roundedGstAmount = (basicAmount * rowGst) / 100;

//     // Calculate total amount
//     const totalAmount = roundedGstAmount + basicAmount;

//     return {
//         basicAmount,
//         roundedGstAmount: Number(roundedGstAmount.toFixed(2)),
//         roundedTotalAmount: Number(totalAmount.toFixed(2)),
//     };
// };


export const orderCalculateFunc = (row) => {
    // Retrieve values from input object
    const rate = Number(row.rate) || 0;
    const quantity = Number(row.quantity) || 0;
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
      basicAmount,
      roundedTotalAmount: Number(totalAmount.toFixed(2)),
      CGST_Amount,
      SGST_Amount,
      roundedGstAmount: roundedGstAmount.toFixed(2),
    };
  };
  