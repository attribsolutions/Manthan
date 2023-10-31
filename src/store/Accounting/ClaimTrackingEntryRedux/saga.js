import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { url } from "../../../routes";
import { date_dmy_func } from "../../../components/Common/CommonFunction";

// List API
function* Get_ClaimTrackingEntry_List_GenFunc({ config }) {     // getList API
    
    const { jsonBody, subPageMode, goBtnMode } = config
    try {
        const response = yield call(apiCall.ClaimList_Get_Api, jsonBody);
        response["goBtnMode"] = goBtnMode;
        
        response.Data.map((i) => {
            i.CreditNoteDate = date_dmy_func(i.CreditNoteDate);
            i.ClaimSummaryDate = date_dmy_func(i.ClaimSummaryDate);
            i.Date = date_dmy_func(i.Date);
            return i
        })
        
        if (subPageMode === url.CLAIM_TRACKING_REPORT) {
            yield put(action.getClaimTrackingEntrySuccess(response));
        }
        else {
            yield put(action.getClaimTrackingEntrySuccess(response.Data));
        }
    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

function* save_ClaimTrackingEntry_GenFunc({ config }) {    // Post API 

    try {
        const response = yield call(apiCall.ClaimList_Post_API, config);
        yield put(action.saveClaimTrackingEntry_Success(response));

    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

function* Edit_ClaimTrackingEntry_ID_GenFunc({ config }) {      // edit API 
    const { btnmode } = config;
    try {
        const response = yield call(apiCall.edit_ClaimTrackingEntry_List_Api, config);
        response.pageMode = btnmode;
        yield put(action.editClaimTrackingEntryIDSuccess(response));
    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

function* Update_ClaimTrackingEntry_ID_GenFunc({ config }) {         // update API
    try {
        const response = yield call(apiCall.update_ClaimTrackingEntry_List_Api, config);
        yield put(action.updateClaimTrackingEntryIDSuccess(response))
    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

function* Delete_ClaimTrackingEntry_ID_GenFunc({ config }) {          // delete API
    try {
        const response = yield call(apiCall.detelet_ClaimTrackingEntry_List_Api, config);
        yield put(action.delete_ClaimTrackingEntryID_Success(response))
    } catch (error) { yield put(action.ClaimTrackingEntryApiErrorAction()) }
}

function* ClaimTrackingEntrySaga() {
    yield takeLatest(actionType.SAVE_CLAIM_TRACKING_ENTRY, save_ClaimTrackingEntry_GenFunc)
    yield takeLatest(actionType.GET_CLAIM_TRACKING_ENTRY_LIST, Get_ClaimTrackingEntry_List_GenFunc)
    yield takeLatest(actionType.EDIT_CLAIM_TRACKING_ENTRY_ID, Edit_ClaimTrackingEntry_ID_GenFunc)
    yield takeLatest(actionType.UPDATE_CLAIM_TRACKING_ENTRY_ID, Update_ClaimTrackingEntry_ID_GenFunc)
    yield takeLatest(actionType.DELETE_CLAIM_TRACKING_ENTRY_ID, Delete_ClaimTrackingEntry_ID_GenFunc)

}

export default ClaimTrackingEntrySaga;  