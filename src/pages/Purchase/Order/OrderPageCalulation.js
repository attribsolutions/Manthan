import { compareGSTINState, roundFixed } from "../../../components/Common/CommonFunction";

export const orderCalculateFunc = (row, IsComparGstIn) => {

  // Retrieve values from input object
  const rate = Number(row.Rate) || 0;
  const quantity = Number(row.Quantity) || 0;
  const gstPercentage = Number(row.GSTPercentage) || 0;
  const discount = Number(row.Discount) || 0;
  const discountType = Number(row.DiscountType) || 2;//discountType ===" % "

  // Calculate basic amount
  const basicAmount = rate * quantity;

  // Calculate the discount amount based on the discount type
  // const disCountAmt = discountType === 2 ? basicAmount - (basicAmount / ((100 + discount) / 100)) : quantity * discount;

  const disCountAmt = discountType === 2
    ? (basicAmount * (discount / 100)) * quantity  // % discount per unit × quantity
    : discountType === 1
      ? discount * quantity                 // ₹ discount per unit × quantity
      : 0;


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

  let GST_Percentage = gstPercentage;
  let IGST_Percentage = 0;
  let SGST_Percentage = (GST_Percentage / 2);
  let CGST_Percentage = (GST_Percentage / 2);

  if (IsComparGstIn) {  //compare Supplier and Customer are Same State by GSTIn Number
    let isSameSate = compareGSTINState(IsComparGstIn.GSTIn_1, IsComparGstIn.GSTIn_2, IsComparGstIn?.IsSEZ)
    if (isSameSate) {// iF isSameSate = true ===not same GSTIn
      CGST_Amount = 0;
      SGST_Amount = 0;
      IGST_Amount = roundFixed(roundedGstAmount, 2);
      IGST_Percentage = GST_Percentage;
      SGST_Percentage = 0;
      CGST_Percentage = 0;
    }
  }
  // Return the calculated values as an object
  debugger
  // return {
  //   basicAmount: basicAmount.toFixed(2),
  //   DiscountType: discountType,
  //   discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
  //   disCountAmt: Number(disCountAmt.toFixed(2)),

  //   roundedTotalAmount: totalAmount.toFixed(2),
  //   roundedGstAmount: roundedGstAmount.toFixed(2),
  //   roundFixed: roundFixed(totalAmount, 2),
  //   CGST_Amount: CGST_Amount.toFixed(2),
  //   SGST_Amount: SGST_Amount.toFixed(2),
  //   IGST_Amount: (IGST_Amount).toFixed(2),

  //   GST_Percentage: GST_Percentage.toFixed(2),
  //   CGST_Percentage: CGST_Percentage.toFixed(2),
  //   SGST_Percentage: SGST_Percentage.toFixed(2),
  //   IGST_Percentage: IGST_Percentage.toFixed(2),

  // };

  return {
    basicAmount: roundFixed(basicAmount, 2),
    DiscountType: discountType,
    discountBaseAmt: Number(roundFixed(discountBaseAmt, 2)),
    disCountAmt: Number(roundFixed(disCountAmt, 2)),
    roundedTotalAmount: roundFixed(totalAmount, 2),
    roundedGstAmount: roundFixed(roundedGstAmount, 2),
    CGST_Amount: roundFixed(CGST_Amount, 2),
    SGST_Amount: roundFixed(SGST_Amount, 2),
    IGST_Amount: roundFixed(IGST_Amount, 2),

    GST_Percentage: roundFixed(GST_Percentage, 2),
    CGST_Percentage: roundFixed(CGST_Percentage, 2),
    SGST_Percentage: roundFixed(SGST_Percentage, 2),
    IGST_Percentage: roundFixed(IGST_Percentage, 2),

  };


};






export function Franchies_Order_Calculate_Func(row, index1, IsComparGstIn,) {

  const discountBasedOnRate = true

  const qty = Number(row.Quantity) || 0;
  const initialRate = Number(row.MRPValue) || 0;
  let rate = Number(row.MRPValue) || 0;
  const gstPercentage = Number(row?.GSTPercentage) || 0;
  const discountValue = Number(row?.Discount) || 0;
  const discountType = Number(row?.DiscountType) || 2;

  let discountAmount = 0;

  // Calculate the discount before Taxable calculation
  if (discountValue > 0 && discountBasedOnRate) {
    if (discountType === 1) {//'Rs'
      rate -= discountValue;
      discountAmount = parseFloat((discountValue * qty).toFixed(2));
    } else {
      discountAmount = parseFloat(((rate * discountValue / 100) * qty).toFixed(2));
      rate = parseFloat((rate - (rate * discountValue / 100)).toFixed(2));
    }
  }

  const grossAmount = qty * rate;

  // Handle case where quantity is zero
  let taxableAmount = 0;
  let taxableRate = 0;

  if (qty !== 0) {
    taxableAmount = parseFloat((grossAmount * 100 / (100 + gstPercentage)).toFixed(2));
    taxableRate = parseFloat((rate * 100 / (100 + gstPercentage)).toFixed(2));
  }

  const cgst = parseFloat((taxableAmount * (gstPercentage / 2) / 100).toFixed(2));
  const sgst = cgst;
  const igst = 0; // Assuming local billing, hence IGST is 0
  const gstAmount = cgst + sgst;

  // Final amount after applying GST
  let itemFinalAmount = taxableAmount + gstAmount;

  // Adjust Taxable Amount and Item Final Amount to handle 1 paisa differences
  if (discountValue === 0) {
    taxableAmount = (qty * rate) - gstAmount;
    itemFinalAmount = taxableAmount + gstAmount;
  } else {
    if (discountType === 1) {//'Rs'
      taxableAmount = (qty * rate) - gstAmount;
      itemFinalAmount = taxableAmount + gstAmount;
    } else {
      taxableAmount = (qty * initialRate) - discountAmount - gstAmount;
      itemFinalAmount = taxableAmount + gstAmount;
    }
  }


  return {
    // discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
    disCountAmt: discountAmount.toFixed(2),
    roundedTotalAmount: itemFinalAmount.toFixed(0),
    basicAmount: taxableAmount.toFixed(2),
    CGST_Amount: cgst.toFixed(2),
    SGST_Amount: sgst.toFixed(2),
    IGST_Amount: igst.toFixed(2),
    roundedGstAmount: gstAmount.toFixed(2),
    IGST_Amount: gstAmount.toFixed(2),
    CGST_Percentage: gstPercentage / 2,
    SGST_Percentage: gstPercentage / 2,
    IGST_Percentage: igst,
    GST_Percentage: gstPercentage

  };
}