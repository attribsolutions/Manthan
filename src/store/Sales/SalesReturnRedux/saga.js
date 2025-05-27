import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { amountCommaSeparateFunc, listpageConcatDateAndTime, date_dmy_func } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";

// Bank list Dropdown API
function* Invoice_No_List_GenFunc({ jsonBody }) {

    try {
        const response = yield call(apiCall.Invoice_No_list_API, jsonBody);
        yield put(action.InvoiceNumberSuccess(response.Data));
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

// add button api for sales return
function* save_SalesReturn_GenFunc({ config }) {
    try {
        const response = yield call(apiCall.SalesReturn_post_API, config);
        yield put(action.saveSalesReturnMaster_Success(response));
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

// GoButton Post API for Sales Return List
function* SalesReturn_List_GenFun({ filters }) {

    try {

        const response = yield call(apiCall.SalesReturn_list_API, filters);
        const newList = yield response.Data.map((i) => {
            i["recordsAmountTotal"] = i.GrandTotal;  // Breadcrumb Count total
            i.GrandTotal = amountCommaSeparateFunc(i.GrandTotal)
            //tranzaction date is only for fiterand page field but UI show transactionDateLabel
            i.dashboardReturnDate = date_dmy_func(i.ReturnDate);
            const DateAndTimeLable = listpageConcatDateAndTime(i.ReturnDate, i.CreatedOn);
            i["transactionDate"] = `${i.CreatedOn}${DateAndTimeLable}`; // transactionDate for sorting and filtering data 
            i["transactionDateLabel"] = DateAndTimeLable;
            i["IsCreditNoteCreated"] = i.IsCreditNoteCreated === 1 ? true : false
            i["IsApproved"] = i.IsApproved === 1 ? true : false
            i["forceDeleteHide"] = ((i.IsApproved)) ? true : false

            return i
        })
        yield put(action.salesReturnListAPISuccess(newList));
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

// delete API
function* delete_SalesReturn_ID_GenFunc({ config }) {

    try {
        const SelectedPartyID = JSON.parse(localStorage.getItem("selectedParty")).value
        const jsonBodyForBackdatedTransaction = JSON.stringify({
            "TransactionDate": config.rowData.ReturnDate,
            "PartyID": SelectedPartyID,
        });
        const BackDateresponse = yield apiCall.CheckStockEntryforBackDatedTransaction({ jsonBody: jsonBodyForBackdatedTransaction })
        if (BackDateresponse.Status === true && BackDateresponse.StatusCode === 400) {
            customAlert({ Type: 3, Message: BackDateresponse.Message });
            yield put(action.SalesReturnApiErrorAction())
            return
        }

        const response = yield call(apiCall.SalesReturn_Delete_API, config);
        yield put(action.delete_SalesReturn_Id_Succcess(response))
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

function* SalesReturn_confirmID_GenFunc({ config }) {

    try {
        const response = yield call(apiCall.SalesReturn_SingleGet_API, config);
        response["pageMode"] = config.pageMode;
        response.Data[0]["viewMode"] = config.viewMode;
        response.Data[0]["ReturnID"] = config.editId;
        response.Data[0].ReturnItems.map((index) => {
            index["selectCheck"] = false
            return index
        });
        yield put(action.confirm_SalesReturn_Id_Succcess(response))
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

function* Return_Approve_GenFunc({ config }) {
    try {
        const response = yield call(apiCall.Return_Approve_API, config);

        yield put(action.returnApprove_Success(response))
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

function* addButton_saleReturn_GenFunc({ config }) {

    try {
        const { jsonBody, InvoiceId, returnMode } = config;
        let response
        if (returnMode === 2) {//returnMode 1 = "itemWise"
            response = yield call(apiCall.SalesReturn_add_button_api_For_Item, jsonBody);
        }
        else if (returnMode === 1) {
            response = yield call(apiCall.SalesReturn_add_button_api_For_CreditNote1, jsonBody);
        }
        else {//returnMode  else = "invoiceWise"
            response = yield call(apiCall.SalesReturn_add_button_api_For_Invoice, InvoiceId);
            response.Data = response.Data.InvoiceItems
        }
        yield put(action.SalesReturnAddBtn_Action_Succcess(response))

    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}

function* sendToSSButton_GenFunc({ config }) { // Update Order by subPageMode

    const { ReturnID } = config
    try {
        const response = yield call(apiCall.Send_To_Superstockiest_button_post_API, config);
        response["ReturnItemID"] = ReturnID
        yield put(action.post_Send_to_superStockiest_Id_Succcess(response))
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}


function* Upload_Return_GenFunc({ config }) {   // update API

    try {
        const response = yield call(apiCall.Upload_Return_Api, config);
        response["Type"] = config.Type
        yield put(action.Upload_Return_Succcess(response))
    } catch (error) { yield put(action.SalesReturnApiErrorAction()) }
}


function* SalesReturnSaga() {
    yield takeLatest(actionType.INVOICE_NUMBER, Invoice_No_List_GenFunc)
    yield takeLatest(actionType.SAVE_SALES_RETURN_MASTER, save_SalesReturn_GenFunc)
    yield takeLatest(actionType.SALES_RETURN_LIST_API, SalesReturn_List_GenFun)
    yield takeLatest(actionType.DELETE_SALES_RETURN_ID, delete_SalesReturn_ID_GenFunc)
    yield takeLatest(actionType.SALES_RETURN_ADD_BUTTON_ACTION, addButton_saleReturn_GenFunc)
    yield takeLatest(actionType.SALES_RETURN_CONFIRM_BUTTON_ACTION, SalesReturn_confirmID_GenFunc)
    yield takeLatest(actionType.POST_SENT_TO_SUPERSTOCKIEST_ID, sendToSSButton_GenFunc)
    yield takeLatest(actionType.RETURN_APPROVE_ACTION, Return_Approve_GenFunc)

    yield takeLatest(actionType.RETURN_UPLOAD_ACTION, Upload_Return_GenFunc)


}
export default SalesReturnSaga;  