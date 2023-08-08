import { compareGSTINState } from "../../../components/Common/CommonFunction";

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

  let GST_Percentage = gstPercentage;
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
    basicAmount: basicAmount.toFixed(2),

    discountBaseAmt: Number(discountBaseAmt.toFixed(2)),
    disCountAmt: Number(disCountAmt.toFixed(2)),

    roundedTotalAmount: totalAmount.toFixed(2),
    roundedGstAmount: roundedGstAmount.toFixed(2),
    CGST_Amount: CGST_Amount.toFixed(2),
    SGST_Amount: SGST_Amount.toFixed(2),
    IGST_Amount: IGST_Amount,

    GST_Percentage: GST_Percentage.toFixed(2),
    CGST_Percentage: CGST_Percentage.toFixed(2),
    SGST_Percentage: SGST_Percentage.toFixed(2),
    IGST_Percentage: IGST_Percentage.toFixed(2),

  };
};





// const saveHandler1 = async (event) => {
//   event.preventDefault();

//   const btnId = event.target.id
//   const gotoInvoiceMode = btnId.substring(0, 14) === "gotoInvoiceBtn";

//   try {
//       const division = _cfunc.loginPartyID();
//       const supplier = supplierSelect.value;

//       const validMsg = []
//       const itemArr = []
//       const isVDC_POvalidMsg = []

//       let IsComparGstIn = { GSTIn_1: supplierSelect.GSTIN, GSTIn_2: _cfunc.loginUserGSTIN() }

//       await orderItemTable.forEach(i => {

//           if ((i.Quantity > 0) && !(i.Rate > 0)) {
//               validMsg.push({ [i.ItemName]: "This Item Rate Is Require..." });
//           }
//           else if (pageMode === mode.edit) {

//               const ischange = (!(Number(i.edit_Qty) === Number(i.Quantity)) || !(i.edit_Unit_id === i.Unit_id));

//               let isedit = 0
//               if (ischange && !(i.edit_Qty === 0)) {
//                   isedit = 1
//               }
//               orderItemFunc({ i, isedit })
//           }
//           else {
//               const isedit = 0;
//               orderItemFunc({ i, isedit })
//           };
//       })


//       function orderItemFunc({ i, isedit }) {

//           i.Quantity = ((i.Quantity === null) || (i.Quantity === undefined)) ? 0 : i.Quantity

//           if ((i.Quantity > 0) && (i.Rate > 0) && !(orderTypeSelect.value === 3)) {
//               var isdel = false;
//               isRowValueChanged({ i, isedit, isdel })
//           }
//           else if (!(i.Quantity < 0) && (i.editrowId) && !(orderTypeSelect.value === 3)) {
//               var isdel = true;
//               isRowValueChanged({ i, isedit, isdel })
//           }
//           else if (!(i.Quantity < 0) && !(i.editrowId) && !(orderTypeSelect.value === 3)) {
//               return
//           }



//           else if ((i.Quantity > 0) && (i.Rate > 0)) {//isvdc_po logic

//               if (i.Bom) {
//                   if ((itemArr.length === 0)) {
//                       const isdel = false;
//                       isRowValueChanged({ i, isedit, isdel })

//                   } else {
//                       if (isVDC_POvalidMsg.length === 0)
//                           isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type Of Order Only One Item Quantity Accept..." });
//                   }
//               } else {
//                   isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
//               }
//           }
//           else if ((i.Quantity < 1) && (i.editrowId)) {
//               if (i.Bom) {
//                   if ((itemArr.length === 0)) {
//                       const isdel = true;
//                       isRowValueChanged({ i, isedit, isdel })

//                   } else {
//                       if (isVDC_POvalidMsg.length === 0)
//                           isVDC_POvalidMsg.push({ ["VDC-PO Type"]: "This Type of order Only One Item Quantity Accept..." });
//                   }
//               } else {
//                   isVDC_POvalidMsg.push({ [i.ItemName]: "This Is Not VDC-PO Item..." });
//               }
//           };
//       }
//       // IsComparGstIn= compare Supplier and Customer are Same State by GSTIn Number


//       function isRowValueChanged({ i, isedit, isdel }) {


//           const calculate = orderCalculateFunc(i, IsComparGstIn)


//           const arr = {
//               Item: i.Item_id,
//               Quantity: isdel ? 0 : i.Quantity,
//               MRP: i.MRP_id,
//               MRPValue: i.MRPValue,
//               Rate: i.Rate,
//               Unit: i.Unit_id,
//               BaseUnitQuantity: (Number(i.BaseUnitQuantity) * Number(i.Quantity)).toFixed(2),
//               Margin: "",

//               GST: i.GST_id,
//               CGST: calculate.CGST_Amount,
//               SGST: calculate.SGST_Amount,
//               IGST: calculate.IGST_Amount,

//               GSTPercentage: calculate.GST_Percentage,
//               CGSTPercentage: calculate.CGST_Percentage,
//               SGSTPercentage: calculate.SGST_Percentage,
//               IGSTPercentage: calculate.IGST_Percentage,

//               BasicAmount: calculate.basicAmount,
//               GSTAmount: calculate.roundedGstAmount,
//               Amount: calculate.roundedTotalAmount,

//               TaxType: 'GST',
//               DiscountType: i.DiscountType,
//               Discount: Number(i.Discount) || 0,
//               DiscountAmount: Number(calculate.disCountAmt).toFixed(2),

//               IsDeleted: isedit,
//               Comment: i.Comment

//           }
//           itemArr.push(arr)
//       };


//       const termsAndCondition = await termsAndConTable.map(i => ({
//           TermsAndCondition: i.value,
//           IsDeleted: i.IsDeleted
//       }))

//       if (isVDC_POvalidMsg.length > 0) {
//           customAlert({
//               Type: 4,
//               Message: isVDC_POvalidMsg,
//           })
//           return
//       };
//       if (validMsg.length > 0) {
//           customAlert({
//               Type: 4,
//               Message: validMsg,
//           })

//           return
//       }
//       if (itemArr.length === 0) {
//           customAlert({
//               Type: 4,
//               Message: "Please Select 1 Item Quantity",
//           })

//           return
//       }
//       if (orderTypeSelect.length === 0) {
//           customAlert({
//               Type: 4,
//               Message: "Please Select PO Type",
//           })
//           return
//       }
//       if ((termsAndCondition.length === 0) && !(subPageMode === url.ORDER_2)
//           && !(subPageMode === url.ORDER_4) && !(subPageMode === url.IB_ORDER)
//       ) {
//           customAlert({
//               Type: 4,
//               Message: "Please Enter One Terms And Condition",
//           })
//           return
//       }

//       const po_JsonBody = {
//           OrderDate: orderdate,
//           // OrderAmount: orderAmount,
//           OrderItem: itemArr,
//           Customer: division,
//           Supplier: supplier,
//           OrderType: order_Type.PurchaseOrder,
//           IsConfirm: false  // PO Order then IsConfirm true
//       }
//       const SO_JsonBody = {
//           OrderDate: orderdate,
//           // OrderAmount: orderAmount,
//           OrderItem: itemArr,
//           Customer: supplier,// swipe supllier 
//           Supplier: division,// swipe Customer
//           OrderType: order_Type.SaleOrder,
//           IsConfirm: true   // SO Order then IsConfirm true
//       }
//       const IB_JsonBody = {
//           DemandDate: orderdate,
//           // DemandAmount: orderAmount,
//           DemandItem: itemArr,
//           Customer: division,
//           Supplier: supplier,
//           OrderType: order_Type.PurchaseOrder,
//       }
//       const comm_jsonBody = {
//           DeliveryDate: deliverydate,
//           Description: description,
//           BillingAddress: billAddr.value,
//           ShippingAddress: shippAddr.value,
//           OrderNo: 1,
//           FullOrderNumber: "PO0001",
//           Division: division,
//           POType: orderTypeSelect.value,
//           POFromDate: orderTypeSelect.value === 1 ? currentDate_ymd : poFromDate,
//           POToDate: orderTypeSelect.value === 1 ? currentDate_ymd : poToDate,
//           CreatedBy: _cfunc.loginUserID(),
//           UpdatedBy: _cfunc.loginUserID(),
//           OrderTermsAndConditions: termsAndCondition
//       };


//       let jsonBody;   //json body decleration 
//       if (subPageMode === url.IB_ORDER) {
//           jsonBody = JSON.stringify({ ...comm_jsonBody, ...IB_JsonBody });
//       }
//       else if (subPageMode === url.ORDER_4) {
//           jsonBody = JSON.stringify({ ...comm_jsonBody, ...SO_JsonBody });
//       }
//       else {
//           jsonBody = JSON.stringify({ ...comm_jsonBody, ...po_JsonBody });
//       }
//       // +*********************************

//       if (pageMode === mode.edit) {
//           dispatch(_act.updateOrderIdAction({ jsonBody, updateId: editVal.id, gotoInvoiceMode }))

//       } else {

//           dispatch(_act.saveOrderAction({ jsonBody, subPageMode, gotoInvoiceMode }))
//       }

//   } catch (e) { _cfunc.CommonConsole("order_save_", e) }
// }