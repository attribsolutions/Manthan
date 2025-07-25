import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { date_dmy_func, loginUserIsFranchisesRole } from "../../../components/Common/CommonFunction";
import { url } from "../../../routes";

function* StockEntry_API_GenFunc({ config }) { // Save GRN  genrator function
    let subPageMode = config.subPageMode
    try {
        let response = "";
        if (loginUserIsFranchisesRole()) {
            response = yield call(apiCall.Franchise_StockEntry_Post_API, config);
        } else if (subPageMode === url.RATE_ADJUSTMENT) {
            response = yield call(apiCall.BatchAdjustment_API, config);
        } else {
            response = yield call(apiCall.StockEntry_Post_API, config);
        }
        yield put(action.saveStockEntrySuccess(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockCount_API_GenFunc({ config }) { // Save GRN  genrator function

    try {
        const response = yield call(apiCall.StockCount_Post_API, config);
        const NewResponse = (response.Data === 0 ? response.Data = false : true)

        yield put(action.GetStockCountSuccess(NewResponse));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* ItemDropDown_API_GenFunc({ config }) { // Save GRN  genrator function
    debugger
    try {
        const response = yield call(apiCall.Item_DropDown_Api, config);
        yield put(action.Get_Items_Drop_Down_Success(response.Data));
        yield put(action.GetlastStockEntryDateSuccess(response.LastStockEntryDate));

    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockEnteryForFirstTransaction_API_GenFunc({ config }) { // Save GRN  genrator function

    try {
        const response = yield call(apiCall.CheckStockEntryForFirstTransaction, config);
        yield put(action.CheckStockEntryForFirstTransactionSuccess(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockenteryForBackDatedTransaction_API_GenFunc({ config }) { // Save GRN  genrator function

    try {
        const response = yield call(apiCall.CheckStockEntryforBackDatedTransaction, config);
        yield put(action.CheckStockEntryforBackDatedTransactionSuccess(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockEntryList_API_GenFunc({ config }) { // Save GRN  genrator function
    try {

        const response = yield call(apiCall.StockEntryList_API, config);
        const newList = yield response.Data.map((i, key) => {
            i.id = key + 1
            i.PriviousStockDate = i.StockDate;
            i.StockDate = date_dmy_func(i.StockDate);
            return i
        })
        yield put(action.GetStockEntryList_Success(newList));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockEntryItemView_API_GenFunc({ config }) { // Save GRN  genrator function
    try {

        let response = yield call(apiCall.StockEntryItemList_API, config);
        response["ItemCount"] = config?.ItemCount
        yield put(action.GetStockEntryView_Success(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* Delete_StockEntry_GenFunc({ config }) {
    debugger
    try {
        const response = yield call(apiCall.StockEntry_Delete_API, config);
        yield put(action.deleteStockEntry_Success(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockEntrySaga() {
    yield takeLatest(actionType.GET_ITEM_DROPDOWM_ACTION, ItemDropDown_API_GenFunc)
    yield takeLatest(actionType.SAVE_STOCK_ENTRY_ACTION, StockEntry_API_GenFunc)
    yield takeLatest(actionType.GET_STOCK_COUNT_ACTION, StockCount_API_GenFunc)
    yield takeLatest(actionType.CHECK_STOCK_ENTERY_FOR_FIRST_TRANSACTION, StockEnteryForFirstTransaction_API_GenFunc)
    yield takeLatest(actionType.CHECK_STOCK_ENTERY_FOR_BACKDATED_TRANSACTION, StockenteryForBackDatedTransaction_API_GenFunc)
    yield takeLatest(actionType.GET_STOCK_ENTRY_LIST_ACTION, StockEntryList_API_GenFunc)
    yield takeLatest(actionType.GET_STOCK_ENTRY_VIEW_ACTION, StockEntryItemView_API_GenFunc)
    yield takeLatest(actionType.DELETE_STOCK_ENTRY, Delete_StockEntry_GenFunc)

}
export default StockEntrySaga;  