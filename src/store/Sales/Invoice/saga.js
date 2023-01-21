import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc, mainSppinerOnOff } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Invoice_Delete_API, Invoice_Get_API, Invoice_GoButton_Post_API, Invoice_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteInvoiceIdSuccess, getIssueListPageSuccess, GoButton_post_For_Invoice_Success, postInvoiceMasterSuccess } from "./action";
import { DELETE_INVOICE_LIST_PAGE, GET_INVOICE_LIST_PAGE, GO_BUTTON_POST_FOR_INVOICE, POST_INVOICE_MASTER } from "./actionType";

// GO Botton Post API
function* GoButtonInvoice_genfun({ data, goBtnId }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Invoice_GoButton_Post_API, data);

    let convResp = response.Data.OrderItemDetails.map(i1 => {

      i1["OrderQty"] = i1.Quantity
      i1["UnitDrop"] = { value: i1.Unit, label: i1.UnitName, ConversionUnit: '1', Unitlabel: i1.UnitName }
      i1["InpStockQtyTotal"] = `${Number(i1.Quantity) * Number(i1.ConversionUnit)}`
      i1["StockTotal"] = 0
      i1["StockUnit"] = '';
      i1["StockValid"] = true;

      let count = Number(i1.Quantity) * Number(i1.ConversionUnit);

      i1.StockDetails = i1.StockDetails.map(i2 => {
        i1.StockUnit = i2.UnitName;

        i1.StockTotal = (Number(i2.BaseUnitQuantity) + Number(i1.StockTotal));

        let qty = Number(i2.BaseUnitQuantity) * Number(i1.ConversionUnit);

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

      count = 0
      return i1
    })
    response.Data.OrderItemDetails = convResp

    yield  mainSppinerOnOff({ id: goBtnId, state: false })
    // yield put(SpinnerState(false))
    yield put(GoButton_post_For_Invoice_Success(response.Data));

  } catch (error) {
    mainSppinerOnOff({ id: goBtnId, state: false })
    // yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message Go Button in Invoice ",
    }));
  }
}

//post api for Invoice Master
function* save_Invoice_Genfun({ data,saveBtnid }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Invoice_Post_API, data);
    yield put(SpinnerState(false))
    
    mainSppinerOnOff({ id: saveBtnid, state: false })
    yield put(postInvoiceMasterSuccess(response));
  } catch (error) {
    mainSppinerOnOff({ id: saveBtnid, state: false })
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message in Invoice",
    }));
  }
}

// Invoice List
function* InvoiceListGenFunc({ filters }) {

  yield put(SpinnerState(true))
  try {

    const response = yield call(Invoice_Get_API, filters);
    const newList = yield response.Data.map((i) => {
      i.InvoiceDate = i.InvoiceDate;
      var date = convertDatefunc(i.InvoiceDate)
      i.InvoiceDate = (date)
      return i
    })
    yield put(getIssueListPageSuccess(newList));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message in Work Order List ",
    }));
  }
}

// Invoice List delete List page
function* DeleteInvoiceGenFunc({ id }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(Invoice_Delete_API, id);
    yield put(SpinnerState(false))
    yield put(deleteInvoiceIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Merssage in Work Order List Delete Method "
    }));
  }
}

function* InvoiceSaga() {
  yield takeEvery(GO_BUTTON_POST_FOR_INVOICE, GoButtonInvoice_genfun)
  yield takeEvery(POST_INVOICE_MASTER, save_Invoice_Genfun)
  yield takeEvery(GET_INVOICE_LIST_PAGE, InvoiceListGenFunc)
  yield takeEvery(DELETE_INVOICE_LIST_PAGE, DeleteInvoiceGenFunc)
}

export default InvoiceSaga;