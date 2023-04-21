import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole, concatDateAndTime } from "../../../components/Common/CommonFunction";

// Bank list Dropdown API
function* Invoice_No_List_GenFunc({ jsonBody }) {
   
    try {
        const response = yield call(apiCall.Invoice_No_list_API, jsonBody);
        yield put(action.InvoiceNumberSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

// add button api for sales return
function*  addButton_for_SalesReturn_GenFunc({ ItemID }) {

    try {
        const response = yield call(apiCall.SalesReturn_add_button_api, ItemID);
        yield put(action.addButton_for_SalesReturn_Success(response.Data));
    } catch (error) { CommonConsole(error) }
}

<<<<<<< HEAD
function* SalesReturnSaga() {
    yield takeEvery(actionType.INVOICE_NUMBER, Invoice_No_List_GenFunc)
    yield takeEvery(actionType.ADD_BUTTON_FOR_SALES_RETURN, addButton_for_SalesReturn_GenFunc)

=======
// GoButton Post API for Sales Return List
function* SalesReturn_List_GenFun({ filters }) {

    try {
        const response = yield call(apiCall.SalesReturn_list_API, filters);
        const newList = yield response.Data.map((i) => {
            i.ReturnDate = concatDateAndTime(i.ReturnDate, i.CreatedOn)
            return i
        })

        yield put(action.salesReturnListAPISuccess(newList));
    } catch (error) { CommonConsole(error) }
}

// delete API
function* delete_SalesReturn_ID_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.SalesReturn_Delete_API, config);
        yield put(action.delete_SalesReturn_Id_Succcess(response))
    } catch (error) { CommonConsole(error) }
}

function* SalesReturnSaga() {
    yield takeEvery(actionType.INVOICE_NUMBER, Invoice_No_List_GenFunc)
    yield takeEvery(actionType.SAVE_SALES_RETURN_MASTER, save_SalesReturn_GenFunc)
    yield takeEvery(actionType.SALES_RETURN_LIST_API, SalesReturn_List_GenFun)
    yield takeEvery(actionType.DELETE_SALES_RETURN_ID, delete_SalesReturn_ID_GenFunc)
>>>>>>> NewCommon
}
export default SalesReturnSaga;  