import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole, date_dmy_func, convertTimefunc, amountCommaSeparateFunc, concatDateAndTime, } from "../../../components/Common/CommonFunction";
import { Loading_Sheet_Del_API, Loading_Sheet_get_API, Loading_Sheet_Go_Button_API, Loading_Sheet_Post_API, Loading_Sheet_Update_API, LoadingSheet_API } from "../../../helpers/backend_helper";
import { DeleteLoadingSheetSucccess, LoadingSheetApiErrorAction, LoadingSheetListActionSuccess, LoadingSheet_GoBtn_API_Succcess, SaveLoadingSheetMasterSucccess, UpdateLoadingSheetSucccess } from "./action";
import { LOADING_SHEET_LIST_ACTION, LOADING_SHEET_GO_BUTTON_API, SAVE_LOADING_SHEET_MASTER, LOADING_SHEET_UPDATE_API, DELETE_LOADING_SHEET } from "./actionType";

// GoButton Post API for Loading Sheet
function* goBtn_Post_API_GenFun({ filters }) {

    try {
        const response = yield call(Loading_Sheet_Go_Button_API, filters);

        response.Data.map((index) => {
            index["selectCheck"] = false
            index["preInvoiceDate"] =date_dmy_func(index.InvoiceDate);
            return index
        });

        yield put(LoadingSheet_GoBtn_API_Succcess(response));
    } catch (error) { CommonConsole(error) }
}

// Post API For Master Page
function* save_LoadingSheet_GenFun({ config }) {
    try {
        const response = yield call(Loading_Sheet_Post_API, config);
        yield put(SaveLoadingSheetMasterSucccess(response));
    } catch (error) { CommonConsole(error) }
}

// loading sheet update button api
function* Update_LoadingSheet_GenFun({ config }) {

    const { RowId, path } = config
    try {
        const response = yield call(Loading_Sheet_Update_API, config);
        response.path = path
        response.Data.InvoiceParent.map((index) => {
            index.GrandTotal = amountCommaSeparateFunc(index.GrandTotal)
            index.AmountPaid = index.GrandTotal
            index["selectCheck"] = false
            index.InvoiceDate = date_dmy_func(index.InvoiceDate);
            return index
        });
        yield put(UpdateLoadingSheetSucccess(response));
    } catch (error) { yield put(LoadingSheetApiErrorAction()) }
}

function* Delete_LoadingSheet_ID_GenratorFunction({ config }) {        // delete API
    try {
        const response = yield call(Loading_Sheet_Del_API, config);
        yield put(DeleteLoadingSheetSucccess(response))
    } catch (error) { yield put(LoadingSheetApiErrorAction()) }
}

// Post API For Master Page
function* get_LoadingSheet_List_GenFun({ filters }) {
    try {
        const response = yield call(Loading_Sheet_get_API, filters);
        const newList = yield response.Data.map((i) => {

            i.TotalAmount = amountCommaSeparateFunc(i.TotalAmount)

            //tranzaction date is only for fiterand page field but UI show transactionDateLabel
            i["transactionDate"] = i.CreatedOn;
            i["transactionDateLabel"] = concatDateAndTime(i.Date, i.CreatedOn);
            return i
        })
        yield put(LoadingSheetListActionSuccess(newList));
    } catch (error) { yield put(LoadingSheetApiErrorAction()) }
}

function* LoadingSheetSaga() {
    yield takeLatest(DELETE_LOADING_SHEET, Delete_LoadingSheet_ID_GenratorFunction)
    yield takeLatest(LOADING_SHEET_UPDATE_API, Update_LoadingSheet_GenFun)
    yield takeLatest(LOADING_SHEET_GO_BUTTON_API, goBtn_Post_API_GenFun)
    yield takeLatest(SAVE_LOADING_SHEET_MASTER, save_LoadingSheet_GenFun)
    yield takeLatest(LOADING_SHEET_LIST_ACTION, get_LoadingSheet_List_GenFun)
}

export default LoadingSheetSaga;