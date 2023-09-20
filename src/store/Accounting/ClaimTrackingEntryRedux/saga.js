import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

// Post API 
function* save_ClaimTrackingEntry_GenFunc({ config }) {
    debugger
    try {
        const response = yield call(apiCall.ClaimList_Post_API, config);
        yield put(action.saveClaimTrackingEntry_Success(response));

    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

// List API
function* Get_ClaimTrackingEntry_List_GenFunc({ config }) {     // getList API
    debugger
    try {
        const response = yield call(apiCall.ClaimList_Get_Api, config);
        yield put(action.getClaimTrackingEntrySuccess(response.Data));
    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

function* ClaimTrackingEntrySaga() {
    yield takeLatest(actionType.SAVE_CLAIM_TRACKING_ENTRY, save_ClaimTrackingEntry_GenFunc)
    yield takeLatest(actionType.GET_CLAIM_TRACKING_ENTRY_LIST, Get_ClaimTrackingEntry_List_GenFunc)
}

export default ClaimTrackingEntrySaga;  