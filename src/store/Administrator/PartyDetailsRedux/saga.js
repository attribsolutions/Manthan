import { call, delay, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* save_PartyDetails_GenFunc({ config }) {
    try {
        const response = yield call(apiCall.post_PartyDetails, config);
        yield put(action.savePartyDetails_Success(response));
    } catch (error) { yield put(action.PartyDetailsApiErrorAction()) }
}

function* PartyDetailsList_GenFunc({ config }) {  // go button api call     
debugger
    try {
        const response = yield call(apiCall.Get_PartyDetails_List, config);
        yield put(action.GoButton_For_PartyDetails_Success(response.Data));
    } catch (error) { yield put(action.PartyDetailsApiErrorAction()) }
}

function* PartyDetailsSaga() {
    yield takeLatest(actionType.SAVE_PARTY_DETAILS, save_PartyDetails_GenFunc)
    yield takeLatest(actionType.GO_BUTTON_PARTY_DETAILS_LIST, PartyDetailsList_GenFunc)
}

export default PartyDetailsSaga;  