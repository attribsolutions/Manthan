import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";

// Bank list Dropdown API
function* Invoice_No_List_GenFunc({ jsonBody }) {

    try {
        const response = yield call(apiCall.Invoice_No_list_API, jsonBody);
        yield put(action.InvoiceNumberSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

// add button api for sales return
function* save_SalesReturn_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.SalesReturn_post_API, config);
        yield put(action.saveSalesReturnMaster_Success(response));
    } catch (error) { CommonConsole(error) }
}

// GoButton Post API for Sales Return List
function* SalesReturn_List_GenFun({ filters }) {
     
    try {
        const response = yield call(apiCall.SalesReturn_list_API, filters);
        yield put(action.salesReturnListAPISuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}
function* SalesReturnSaga() {
    yield takeEvery(actionType.INVOICE_NUMBER, Invoice_No_List_GenFunc)
    yield takeEvery(actionType.SAVE_SALES_RETURN_MASTER, save_SalesReturn_GenFunc)
    yield takeEvery(actionType.SALES_RETURN_LIST_API, SalesReturn_List_GenFun)
}
export default SalesReturnSaga;  