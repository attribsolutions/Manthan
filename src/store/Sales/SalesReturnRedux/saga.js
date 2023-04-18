import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";

// Bank list Dropdown API
function* Invoice_No_List_GenFunc({ jsonBody }) {
    debugger
    try {
        const response = yield call(apiCall.Invoice_No_list_API, jsonBody);
        yield put(action.InvoiceNumberSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* SalesReturnSaga() {
    yield takeEvery(actionType.INVOICE_NUMBER, Invoice_No_List_GenFunc)

}
export default SalesReturnSaga;  