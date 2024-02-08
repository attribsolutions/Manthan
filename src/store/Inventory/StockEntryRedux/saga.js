import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* StockEntry_API_GenFunc({ config }) { // Save GRN  genrator function

    try {
        const response = yield call(apiCall.StockEntry_Post_API, config);
        yield put(action.saveStockEntrySuccess(response));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}


function* StockCount_API_GenFunc({ config }) { // Save GRN  genrator function
    debugger
    try {
        const response = yield call(apiCall.StockCount_Post_API, config);

        const NewResponse = (response.Data === 0 ? response.Data = false : true)

        yield put(action.GetStockCountSuccess(NewResponse));
    } catch (error) { yield put(action.StockEntryApiErrorAction()) }
}

function* StockEntrySaga() {

    yield takeLatest(actionType.SAVE_STOCK_ENTRY_ACTION, StockEntry_API_GenFunc)
    yield takeLatest(actionType.GET_STOCK_COUNT_ACTION, StockCount_API_GenFunc)

}
export default StockEntrySaga;  