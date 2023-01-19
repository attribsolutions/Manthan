import { call, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { Invoice_Get_API, Invoice_GoButton_Post_API, Invoice_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getIssueListPageSuccess, GoButton_post_For_Invoice_Success, postInvoiceMasterSuccess } from "./action";
import { GET_INVOICE_LIST_PAGE, GO_BUTTON_POST_FOR_INVOICE, POST_INVOICE_MASTER } from "./actionType";

// GO Botton Post API
function* GoButtonInvoice_genfun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Invoice_GoButton_Post_API, data);

    let convResp = response.Data.OrderItemDetails.map(i1 => {
      debugger
      i1["OrderQty"] = i1.Quantity
      i1["UnitDrop"] = { value: i1.Unit, label: i1.UnitName, ConversionUnit: '1', Unitlabel: i1.UnitName }
      i1["StockTotal"] = 0
      i1["StockUnit"] = ''
     
      let f1 = i1.UnitDetails.find(e1 => (e1.Unit === i1.Unit));
      let Conversion = 1
      if (f1) {
        Conversion = Number(f1.ConversionUnit);
        i1.StockUnit = f1.Unitlabel
      }
      let count = Number(i1.Quantity) * Number(Conversion);

      i1.StockDetails = i1.StockDetails.map(i2 => {
        i1.StockTotal = (Number(i2.BaseUnitQuantity) + Number(i1.StockTotal));

        let qty = Number(i2.BaseUnitQuantity) * Conversion;

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
      i1["InpStockQtyTotal"] = `${Number(i1.Quantity) * Number(Conversion)}`
      count = 0
      return i1
    })
    response.Data.OrderItemDetails = convResp
    yield put(SpinnerState(false))
    yield put(GoButton_post_For_Invoice_Success(convResp));

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message Go Button in Invoice ",
    }));
  }
}

//post api for Invoice Master
function* save_Invoice_Genfun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Invoice_Post_API, data);
    yield put(SpinnerState(false))
    yield put(postInvoiceMasterSuccess(response));
  } catch (error) {
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
function* InvoiceSaga() {
  yield takeEvery(GO_BUTTON_POST_FOR_INVOICE, GoButtonInvoice_genfun)
  yield takeEvery(POST_INVOICE_MASTER, save_Invoice_Genfun)
  yield takeEvery(GET_INVOICE_LIST_PAGE, InvoiceListGenFunc)
}

export default InvoiceSaga;