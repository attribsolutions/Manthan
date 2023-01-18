import { call, put, takeEvery } from "redux-saga/effects";
import { Invoice_GoButton_Post_API, Invoice_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { GoButton_post_For_Invoice_Success, postInvoiceMasterSuccess } from "./action";
import { GO_BUTTON_POST_FOR_INVOICE, POST_INVOICE_MASTER } from "./actionType";

// GO Botton Post API
function* GoButtonInvoice_genfun({ data }) {
    yield put(SpinnerState(true))
    try {
        const response = yield call(Invoice_GoButton_Post_API, data);
        yield put(SpinnerState(false))
        yield put(GoButton_post_For_Invoice_Success(response.Data));

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

function* InvoiceSaga() {
    yield takeEvery(GO_BUTTON_POST_FOR_INVOICE, GoButtonInvoice_genfun)
    yield takeEvery(POST_INVOICE_MASTER, save_Invoice_Genfun)
 }

export default InvoiceSaga;