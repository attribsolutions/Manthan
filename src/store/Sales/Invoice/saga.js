import { actionChannel, call, put, takeEvery } from "redux-saga/effects";
import {
  convertDatefunc,
  GoBtnDissable,
  saveDissable
} from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  Invoice_Delete_API,
  Invoice_Edit_API_Singel_Get,
  Invoice_Get_API,
  Invoice_GoButton_Post_API,
  Invoice_Post_API,
  Make_IB_Invoice_API
} from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import {
  deleteInvoiceIdSuccess,
  editInvoiceListSuccess,
  getIssueListPageSuccess,
  GoButton_For_Invoice_Add_Success,
  GoButton_post_For_Invoice_Success,
  postInvoiceMasterSuccess
} from "./action";
import {
  DELETE_INVOICE_LIST_PAGE,
  EDIT_INVOICE_LIST, GET_INVOICE_LIST_PAGE,
  GO_BUTTON_FOR_INVOICE_ADD,
  GO_BUTTON_POST_FOR_INVOICE, POST_INVOICE_MASTER
} from "./actionType";
import *as url from "../../../routes/route_url"





//post api for Invoice Master
function* save_Invoice_Genfun({ data, saveBtnid }) {

  try {
    const response = yield call(Invoice_Post_API, data);


    saveDissable({ id: saveBtnid, state: false })
    yield put(postInvoiceMasterSuccess(response));
  } catch (error) {
    saveDissable({ id: saveBtnid, state: false })

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message in Invoice",
    }));
  }
}

// Invoice List
function* InvoiceListGenFunc({ filters }) {


  try {

    const response = yield call(Invoice_Get_API, filters);
    const newList = yield response.Data.map((i) => {
      i.InvoiceDate = i.InvoiceDate;
      var date = convertDatefunc(i.InvoiceDate)
      i.InvoiceDate = (date)
      return i
    })
    yield put(getIssueListPageSuccess(newList));

  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message in Work Order List ",
    }));
  }
}

// edit List page
function* editInvoiceListGenFunc({ id, pageMode }) {

  try {
    let response = yield call(Invoice_Edit_API_Singel_Get, id);
    response.pageMode = pageMode

    yield put(editInvoiceListSuccess(response))
  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Invoice Edit Method ",
    }));
  }
}

// Invoice List delete List page
function* DeleteInvoiceGenFunc({ id }) {


  try {
    const response = yield call(Invoice_Delete_API, id);

    yield put(deleteInvoiceIdSuccess(response));
  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Merssage in Work Order List Delete Method "
    }));
  }
}

// GO-Botton SO-invoice Add Page API
function* invoice_GoButton_dataConversion_Func(action) {
  const { response, goBtnId } = { ...action };
  debugger
  try {
    let convResp = response.Data.OrderItemDetails.map(i1 => {

      i1["OrderQty"] = i1.Quantity
      i1["UnitDrop"] = { value: i1.Unit, label: i1.UnitName, ConversionUnit: '1', Unitlabel: i1.UnitName }
      i1["InpStockQtyTotal"] = `${Number(i1.Quantity) * Number(i1.ConversionUnit)}`
      i1["StockTotal"] = 0
      i1["StockUnit"] = '';
      i1["StockInValid"] = false;
      i1["StockInvalidMsg"] = '';

      let count = Number(i1.Quantity) * Number(i1.ConversionUnit);

      i1.StockDetails = i1.StockDetails.map(i2 => {

        i1.StockUnit = i2.UnitName;
        i1.StockTotal = (Number(i2.BaseUnitQuantity) + Number(i1.StockTotal));
        let qty = Number(i2.BaseUnitQuantity);

        if ((count > qty) && !(count === 0)) {
          count = count - qty
          i2.Qty = qty.toFixed(3)
        } else if ((count <= qty) && (count > 0)) {
          i2.Qty = count.toFixed(3)
          count = 0
        }
        else {
          i2.Qty = 0;
        }
        return i2
      });

      let t1 = Number(i1.StockTotal);
      let t2 = Number(i1.Quantity) * i1.ConversionUnit;
      if (t1 < t2) {
        i1.StockInValid = true
        let diffrence = Math.abs(i1.Quantity * i1.ConversionUnit - i1.StockTotal);
        var msg1 = `Short Stock Quantity ${i1.Quantity} ${i1.UnitName}`
        var msg2 = `Short Stock Quantity ${diffrence} ${i1.StockUnit}`
        i1.StockInvalidMsg = (i1.StockTotal === 0) ? msg1 : msg2
      };


      return i1
    })

    response.Data.OrderItemDetails = convResp
    yield GoBtnDissable({ id: goBtnId, state: false })
    yield put(GoButton_For_Invoice_Add_Success(response.Data));

  } catch (error) {

  }
}


function* gobutton_invoiceAdd_genFunc(action) {
  try {
    const { subPageMode, data, goBtnId } = action
    let response;
debugger
    if (subPageMode === url.INVOICE_1) {
      response = yield call(Invoice_GoButton_Post_API, data); // GO-Botton SO-invoice Add Page API
    }
    else if (subPageMode === url.INVOICE_1) {
      response = yield call(Make_IB_Invoice_API, data); // GO-Botton IB-invoice Add Page API
    }
    yield invoice_GoButton_dataConversion_Func({ response, goBtnId })
  } catch (e) {

  }
}
function* InvoiceSaga() {
  // yield takeEvery(GO_BUTTON_POST_FOR_INVOICE, GoButtonSOInvoice_genfun)
  yield takeEvery(POST_INVOICE_MASTER, save_Invoice_Genfun)
  yield takeEvery(GET_INVOICE_LIST_PAGE, InvoiceListGenFunc)
  yield takeEvery(EDIT_INVOICE_LIST, editInvoiceListGenFunc)
  yield takeEvery(DELETE_INVOICE_LIST_PAGE, DeleteInvoiceGenFunc)
  yield takeEvery(GO_BUTTON_FOR_INVOICE_ADD, gobutton_invoiceAdd_genFunc)

}

export default InvoiceSaga;