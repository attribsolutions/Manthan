// import { compareGSTINState } from "../../../../components/Common/CommonFunction";

import { compareGSTINState, loginSystemSetting } from "../../../../components/Common/CommonFunction";


export const balkInvoiceAllOrderAmountFunc = ({
    IsTCSParty = false,
    IsCustomerPAN = false,
    bulkInvoceInfo
}) => {
    if (!bulkInvoceInfo) return { sumOfInvoiceTotal: 0 };


    // Calculate the sum of the item TotalAmount in the tableList
    let sumOfInvoiceTotal = 0;

    Object.values(bulkInvoceInfo).forEach(orderInfo => {

        const { sumOfGrandTotal } = settingBaseRoundOffOrderAmountFunc({
            orderInfo: orderInfo, IsTCSParty, IsCustomerPAN,
        })
        sumOfInvoiceTotal += Number(sumOfGrandTotal) || 0;
    });

    return { sumOfInvoiceTotal };
};

export const settingBaseRoundOffOrderAmountFunc = ({
    IsTCSParty = false,
    IsCustomerPAN = false,
    sumOfItemAmount
}) => {
  

    // Get the system settings
    const systemSetting = loginSystemSetting();
    const isGrandAmtRound = systemSetting.InvoiceAmountRoundConfiguration === '1';
    const isTCS_AmtRound = systemSetting.TCSAmountRoundConfiguration === '1';
    const TCSValidatedPAN = Number(systemSetting.IsTCSPercentageforValidatedPANCustomer);
    const TCSNonValidatedPAN = Number(systemSetting.IsTCSPercentageforNonValidatedPANCustomer);

    let TCS_Amount = 0; // Initial TCS Amount

    if (IsTCSParty) {
        // Calculate TCS tax only if IsTCSParty flag is true
        if (IsCustomerPAN) {
            // Calculate TCS for validated PAN customer (IsCustomerPAN has value true)
            TCS_Amount = sumOfItemAmount * (TCSValidatedPAN / 100);
            sumOfItemAmount += TCS_Amount;
        } else {
            // Calculate TCS for non-validated PAN customer
            TCS_Amount = sumOfItemAmount * (TCSNonValidatedPAN / 100);
            sumOfItemAmount += TCS_Amount;
        }
    }

    return {
        sumOfItemAmount: isGrandAmtRound ? Math.round(sumOfItemAmount) : Number(sumOfItemAmount).toFixed(2),
        RoundOffAmount: (Math.round(sumOfItemAmount) - sumOfItemAmount).toFixed(2),
        TCS_Amount: isTCS_AmtRound ? Math.round(TCS_Amount) : Number(TCS_Amount).toFixed(2),
    };
    
};


export const itemAmounWithGst = (props) => {

    // Extract values from the input parameters
    const rate = Number(props.Rate) || 0;
    const quantity = Number(props.modifiedQuantity) || 0;
    const gstpercentage = Number(props.GSTPercentage) || 0;
    const discount = Number(props.Discount) || 0;
    const discountType = props.DiscountType?.value || 2;
    const IsComparGstIn = props.IsComparGstIn;

    // Calculate the base amount
    const basicAmount = rate * quantity;

    // Calculate the discount amount based on the discount type
    const disCountAmt = discountType === 2 ? basicAmount - (basicAmount / ((100 + discount) / 100)) : quantity * discount;

    // Calculate the discounted base amount
    const discountBaseAmt = basicAmount - disCountAmt;

    // Calculate the GST amount
    let gstAmt = discountBaseAmt * (gstpercentage / 100);
    let CGST_Amount = Number((gstAmt / 2).toFixed(2));
    let SGST_Amount = CGST_Amount;
    let IGST_Amount = 0 //initial GST Amount 

    // Calculate the total amount after discount and GST
    const roundedGstAmount = CGST_Amount + SGST_Amount;
    let totalAmount = roundedGstAmount + discountBaseAmt;

    let GST_Percentage = Number(gstpercentage) || 0;
    let IGST_Percentage = 0;
    let SGST_Percentage = (GST_Percentage / 2);
    let CGST_Percentage = (GST_Percentage / 2);

    if (IsComparGstIn) {  //compare Supplier and Customer are Same State by GSTIn Number
        let isSameSate = compareGSTINState(IsComparGstIn?.GSTIn_1, IsComparGstIn?.GSTIn_2)
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

