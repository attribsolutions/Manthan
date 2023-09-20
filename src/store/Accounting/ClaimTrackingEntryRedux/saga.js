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

function* ClaimTrackingEntrySaga() {
    yield takeLatest(actionType.SAVE_CLAIM_TRACKING_ENTRY, save_ClaimTrackingEntry_GenFunc)

}

export default ClaimTrackingEntrySaga;  