import { call, put, takeLatest } from "redux-saga/effects";
import {
  CommonConsole,
  amountCommaSeparateFunc,
  listpageConcatDateAndTime,
  loginSystemSetting,
  loginUserDetails,
  loginUserID,
  roundToDecimalPlaces,
} from "../../../components/Common/CommonFunction";
import {
  Invoice_1_GoButton_API,
  Invoice_1_Save_API,
  Invoice_1_Delete_API,
  Invoice_Singel_Get_for_Report_Api,
  Invoice_1_Get_Filter_API,
  IB_Invoice_GoButton_API,
  IB_Invoice_Save_API,
  IB_Invoice_Get_Filter_API,
  IB_Invoice_Edit_API_Singel_Get,
  IB_Invoice_Delete_API,
  EInvoice_Uploade_Get_API,
  EInvoice_Cancel_Get_API,
  EwayBill_Uploade_Get_API,
  EwayBill_Cancel_Get_API,
  Update_Vehicle_Invoice_API,
  Invoice_Send_To_Scm,
  Invoice_1_Edit_API,
  Invoice_1_Update_API,
} from "../../../helpers/backend_helper";
import {
  deleteInvoiceIdSuccess,
  editInvoiceActionSuccess,
  invoiceListGoBtnfilterSucccess,
  GoButtonForinvoiceAddSuccess,
  invoiceSaveActionSuccess,
  makeIB_InvoiceActionSuccess,
  InvoiceApiErrorAction,
  Uploaded_EInvoiceSuccess,
  Uploaded_EwayBillSuccess,
  Cancel_EInvoiceSuccess,
  Cancel_EwayBillSuccess,
  UpdateVehicleInvoice_Success,
  InvoiceSendToScmSuccess,
  updateInvoiceActionSuccess,
} from "./action";
import {
  DELETE_INVOICE_LIST_PAGE,
  EDIT_INVOICE_ACTION, INVOICE_LIST_GO_BUTTON_FILTER,
  GO_BUTTON_FOR_INVOICE_ADD,
  INVOICE_SAVE_ADD_PAGE_ACTION,
  MAKE_IB_INVOICE_ACTION,
  UPLOADED_E_INVOICE_ACTION,
  UPLOADED_E_WAY_BILL_ACTION,
  CANCLE_E_WAY_BILL_ACTION,
  CANCLE_E_INVOICE_ACTION,
  UPDATE_VEHICLE_INVOICE_ACTION,
  INVOICE_SEND_TO_SCM_ACTION,
  UPDATE_INVOICE_ACTION,

} from "./actionType";
import *as url from "../../../routes/route_url"
import { invoice_discountCalculate_Func } from "../../../pages/Sale/Invoice/invoiceCaculations";
import { orderApprovalActionSuccess } from "../../actions";

//post api for Invoice Master
function* save_Invoice_Genfun({ config }) {
  const { subPageMode, btnId, saveAndDownloadPdfMode } = config;
  try {

    if (subPageMode === url.INVOICE_1) {
      let response = yield call(Invoice_1_Save_API, config);
      response["btnId"] = btnId
      response["saveAndDownloadPdfMode"] = saveAndDownloadPdfMode
      yield put(invoiceSaveActionSuccess(response))
    } if (subPageMode === url.IB_INVOICE) {
      let response = yield call(IB_Invoice_Save_API, config);
      yield put(invoiceSaveActionSuccess(response))
    }
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

function* Invoice_Send_To_Scm_GenFun({ config }) {         // Save API

  try {
    const response = yield call(Invoice_Send_To_Scm, config);
    yield put(InvoiceSendToScmSuccess(response));
  } catch (error) { yield put(InvoiceApiErrorAction()) }
}


// Invoice List
function* InvoiceListGenFunc({ config }) {

  const isSendToScm = loginSystemSetting().InvoiceSendToSCMButton
  const PartyTypeID = loginUserDetails().PartyTypeID
  try {
    const { subPageMode } = config
    let response;

    if ((subPageMode === url.INVOICE_LIST_1) || (subPageMode === url.LOADING_SHEET)) {
      response = yield call(Invoice_1_Get_Filter_API, config);
    } else if (subPageMode === url.IB_INVOICE_LIST || subPageMode === url.IB_GRN_LIST || subPageMode === url.IB_INWARD_STP) {
      response = yield call(IB_Invoice_Get_Filter_API, config);
    }

    const newList = yield response.Data.map((i) => {
      i.forceDeleteHide = false;
      i["recordsAmountTotal"] = i.GrandTotal;  // Breadcrumb Count total
      i.GrandTotal = amountCommaSeparateFunc(i.GrandTotal);//  GrandTotal show with commas
      if (i.LoadingSheetCreated === true) {
        i["LoadingSheetCreated"] = "LoadingSheet Created"
      } else {
        i["LoadingSheetCreated"] = ""
      }
      i["isSendToScm"] = isSendToScm
      i["PartyTypeID"] = PartyTypeID

      //tranzaction date is only for fiterand page field but UI show transactionDateLabel
      i["transactionDate"] = i.CreatedOn;

      i["transactionDateLabel"] = listpageConcatDateAndTime(i.InvoiceDate, i.CreatedOn);

      // if InvoiceUploads array length is greater than 0 then delete button disabled
      if (i.InvoiceUploads.length > 0) {
        i.InvoiceUploads.map((index) => {
          if (!(index.EInvoicePdf === null) || !(index.EwayBillUrl === null)) {
            i.forceDeleteHide = true;
            if ((index.EInvoiceIsCancel) || (index.EwayBillIsCancel)) {
              i.forceDeleteHide = false;
            }
          }
        });
      }
      return i
    })
    yield put(invoiceListGoBtnfilterSucccess(newList));

  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// edit List page
function* editInvoiceListGenFunc({ config }) {
  try {

    const { path, customer, btnmode, editId } = config;

    let response = yield call(Invoice_1_Edit_API, config);

    response["path"] = path;
    response.editId = editId;
    response.customer = customer;
    response.pageMode = btnmode;

    const updatedResp = invoice_GoButton_dataConversion_Func(response, customer);

    yield put(editInvoiceActionSuccess(updatedResp))
  } catch (error) { CommonConsole(error) }
}
//update Invoice 
function* updateInvoiceGenFunc({ config }) {
  debugger
  try {
    const response = yield call(Invoice_1_Update_API, config);
    yield put(updateInvoiceActionSuccess(response))
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// Invoice List delete List page
function* DeleteInvoiceGenFunc({ config }) {
  try {
    const { subPageMode } = config;
    let response;

    if (subPageMode === url.INVOICE_LIST_1) {
      response = yield call(Invoice_1_Delete_API, config)
    } else if (subPageMode === url.IB_INVOICE_LIST) {
      response = yield call(IB_Invoice_Delete_API, config)
    }

    yield put(deleteInvoiceIdSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// GO-Botton SO-invoice Add Page API
function invoice_GoButton_dataConversion_Func(response, customer = '') {


  // Iterate over OrderItemDetails array and perform data conversion
  response.Data.OrderItemDetails = response.Data.OrderItemDetails.map(index1 => {
    const isUnitIDPresent = index1.UnitDetails.find(findEle => findEle.UnitID === index1.Unit);
    const isMCunitID = index1.UnitDetails.find(findEle => findEle.DeletedMCUnitsUnitID === index1.DeletedMCUnitsUnitID);
    const defaultunit = isUnitIDPresent!==undefined ? isUnitIDPresent : isMCunitID;
debugger
    const { IsTCSParty, ISCustomerPAN } = customer;

    index1.Quantity = roundToDecimalPlaces(index1.Quantity, 3);  //initialize // Round to 3 decimal places
    index1.Discount = roundToDecimalPlaces(index1.Discount, 2);// Round to 2 decimal places
    index1.OrderQty = index1.Quantity;//initialize
    index1.default_UnitDropvalue = {//initialize
      value: index1.Unit,
      label: index1.UnitName,
      ConversionUnit: '1',
      Unitlabel: index1.UnitName,
      BaseUnitQuantity: defaultunit.BaseUnitQuantity,
      BaseUnitQuantityNoUnit: defaultunit.BaseUnitQuantity,
    };
    index1.InpStockQtyTotal = `${Number(index1.Quantity) * Number(index1.ConversionUnit)}`;
    index1.StockInValid = false;  //initialize
    index1.StockInvalidMsg = '';  //initialize
    index1.IsTCSParty = IsTCSParty  //initialize  //is tcsParty flag for
    index1.IsCustomerPAN = ISCustomerPAN //initialize


    let totalAmount = 0;
    let remainingOrderQty = parseFloat(index1.Quantity); // Convert to a number
    let totalStockQty = 0;

    // Iterate over StockDetails array and perform data conversion
    index1.StockDetails = index1.StockDetails.map(index2 => {

      index2.initialRate = index2.Rate;  //initialize

      const _hasRate = ((defaultunit.BaseUnitQuantity / defaultunit.BaseUnitQuantityNoUnit) * index2.initialRate);
      const _hasActualQuantity = (index2.BaseUnitQuantity / defaultunit.BaseUnitQuantity);


      index2.Rate = roundToDecimalPlaces(_hasRate, 2);//max 2 decimal  //initialize
      index2.ActualQuantity = roundToDecimalPlaces(_hasActualQuantity, 3);//max 3 decimal  //initialize

      //+++++++++++++++++++++ stock Distribute +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      const stockQty = parseFloat(index2.ActualQuantity); // Convert to a number
      totalStockQty += stockQty;

      const qtyToDeduct = Math.min(remainingOrderQty, stockQty);
      index2.Qty = roundToDecimalPlaces(qtyToDeduct, 3); // Round to three decimal places
      remainingOrderQty = roundToDecimalPlaces(remainingOrderQty - qtyToDeduct, 3); // Round the remaining order quantity

      if (qtyToDeduct > 0) {// Calculate total amount if quantity is greater than 0
        const calculatedItem = invoice_discountCalculate_Func(index2, index1);
        totalAmount += parseFloat(calculatedItem.roundedTotalAmount); // Convert to a number
      }

      return index2;
    });
    //+++++++++++++++++++++++++++++++++++++++++++++++++++




    index1.ItemTotalStock = roundToDecimalPlaces(totalStockQty, 3); //max 3 decimal
    index1.ItemTotalAmount = roundToDecimalPlaces(totalAmount, 2); //max 2 decimal

    // Check for stock availability and set corresponding message
    if (index1.ItemTotalStock < index1.Quantity) {
      index1.StockInValid = true;
      const diffrence = Math.abs(index1.ItemTotalStock - index1.Quantity);
      const msg1 = `Short Stock Quantity ${index1.Quantity}`;
      const msg2 = `Short Stock Quantity ${diffrence}`;
      index1.StockInvalidMsg = index1.ItemTotalStock === 0 ? msg1 : msg2;
    }

    return index1;
  });

  return response;
}

function* gobutton_invoiceAdd_genFunc({ config }) {
  const { subPageMode, path, pageMode, customer, errorMsg, } = config;

  try {

    let response;

    if (subPageMode === url.INVOICE_1) {
      response = yield call(Invoice_1_GoButton_API, config); // GO-Botton SO-invoice Add Page API
    }
    else if (subPageMode === url.IB_INVOICE) {
      response = yield call(IB_Invoice_GoButton_API, config); // GO-Botton IB-invoice Add Page API
    }
    else if (subPageMode === url.INVOICE_LIST_1) {
      response = yield call(Invoice_1_GoButton_API, config); // invoice Edit API
    }

    response["path"] = path
    response["page_Mode"] = pageMode
    response["customer"] = customer

    const updatedResp = invoice_GoButton_dataConversion_Func(response, customer)

    yield put(GoButtonForinvoiceAddSuccess(updatedResp));

  } catch (error) {

    yield put(InvoiceApiErrorAction())
    CommonConsole(error)

    if (errorMsg) {//if ErrorMsg True means the SO-Order GOTo-Invoice Button hit After GoBtnAdd Api Hitt and get error
      yield put(orderApprovalActionSuccess({
        Status: true,
        Message: errorMsg
      }))
    }
  }
}

function* makeIB_InvoiceGenFunc({ body }) {
  try {
    const { jsonBody, goBtnId, path, pageMode, customer } = body
    const response = yield call(IB_Invoice_GoButton_API, jsonBody); // GO-Botton IB-invoice Add Page API
    response["path"] = path
    response["page_Mode"] = pageMode
    response["customer"] = customer

    yield invoice_GoButton_dataConversion_Func({ response, goBtnId })
    yield put(makeIB_InvoiceActionSuccess(response))

  } catch (error) {
    yield put(InvoiceApiErrorAction())
    CommonConsole(error)
  }
}
//**************************** E-Invoice (upload ,cancel,) ***************************************/

function* Uploade_EInvoiceGenFunc({ config }) {
  config["UserID"] = loginUserID();
  try {
    const response = yield call(EInvoice_Uploade_Get_API, config)
    yield put(Uploaded_EInvoiceSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

function* Cancle_EInvoiceGenFunc({ config }) {
  config["UserID"] = loginUserID();
  try {
    const response = yield call(EInvoice_Cancel_Get_API, config)
    yield put(Cancel_EInvoiceSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

//**************************** E-WayBill (upload ,cancel) actions ***************************************/

function* Uploade_EwayBillGenFunc({ config }) {
  config["UserID"] = loginUserID()
  try {
    const response = yield call(EwayBill_Uploade_Get_API, config)
    yield put(Uploaded_EwayBillSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

function* Cancle_EwayBillGenFunc({ config }) {
  config["UserID"] = loginUserID()
  try {
    const response = yield call(EwayBill_Cancel_Get_API, config)
    yield put(Cancel_EwayBillSuccess(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// UpdateVehicleInvoice
function* UpdateVehicleInvoice_GenFunc({ config }) {

  try {
    const response = yield call(Update_Vehicle_Invoice_API, config)
    yield put(UpdateVehicleInvoice_Success(response));
  } catch (error) {
    yield put(InvoiceApiErrorAction())
  }
}

// MAKE_IB_INVOICE_ACTION
function* InvoiceSaga() {

  yield takeLatest(INVOICE_SEND_TO_SCM_ACTION, Invoice_Send_To_Scm_GenFun);
  yield takeLatest(INVOICE_SAVE_ADD_PAGE_ACTION, save_Invoice_Genfun);
  yield takeLatest(INVOICE_LIST_GO_BUTTON_FILTER, InvoiceListGenFunc);
  yield takeLatest(EDIT_INVOICE_ACTION, editInvoiceListGenFunc);
  yield takeLatest(UPDATE_INVOICE_ACTION, updateInvoiceGenFunc);
  yield takeLatest(DELETE_INVOICE_LIST_PAGE, DeleteInvoiceGenFunc);
  yield takeLatest(GO_BUTTON_FOR_INVOICE_ADD, gobutton_invoiceAdd_genFunc);
  yield takeLatest(MAKE_IB_INVOICE_ACTION, makeIB_InvoiceGenFunc);
  yield takeLatest(UPLOADED_E_INVOICE_ACTION, Uploade_EInvoiceGenFunc);
  yield takeLatest(UPLOADED_E_WAY_BILL_ACTION, Uploade_EwayBillGenFunc);
  yield takeLatest(CANCLE_E_WAY_BILL_ACTION, Cancle_EwayBillGenFunc);
  yield takeLatest(CANCLE_E_INVOICE_ACTION, Cancle_EInvoiceGenFunc);
  yield takeLatest(UPDATE_VEHICLE_INVOICE_ACTION, UpdateVehicleInvoice_GenFunc);
}

export default InvoiceSaga;




