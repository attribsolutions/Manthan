import { call, put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    deletePartySubPartySuccess,
    getPartySubPartySuccess,
    postPartySubPartySuccess,
    updatePartySubPartySuccess,
} from "./action";
import {
    PartySubParty_Delete_API,
    PartySubParty_Edit_API,
    PartySubParty_Get_API,
    PartySubParty_Post_API,
    PartySubParty_Update_API,
} from "../../../helpers/backend_helper";

import {
    DELETE_PARTY_SUB_PARTY,
    EDIT_PARTY_SUB_PARTY,
    EDIT_PARTY_SUB_PARTY_SUCCESS,
    GET_PARTY_SUB_PARTY_LIST,
    POST_PARTY_SUB_PARTY,
} from "./actionType"
import { AlertState } from "../../actions";

function* getListGenFunc() {
    yield put(SpinnerState(true))
    try {
        const response = yield call(PartySubParty_Get_API);
        yield put(getPartySubPartySuccess(response.Data));
        yield put(SpinnerState(false))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}
function* postGenFunc({ data }) {
    yield put(SpinnerState(true))
    try {
        const response = yield call(PartySubParty_Post_API, data);
        yield put(SpinnerState(false))
        yield put(postPartySubPartySuccess(response));
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* deleteGenFunc({ id }) {
    try {
        yield put(SpinnerState(true))
        const response = yield call(PartySubParty_Delete_API, id);
        yield put(SpinnerState(false))
        yield put(deletePartySubPartySuccess(response))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* editGenFunc({ id, pageMode }) {
    try {
        const response = yield call(PartySubParty_Edit_API, id);
        response.pageMode = pageMode
        yield put(deletePartySubPartySuccess(response));
        console.log("response in saga", response)

    } catch (error) {
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

function* updateGenFunc({ updateData, ID }) {
    try {
        yield put(SpinnerState(true))
        const response = yield call(PartySubParty_Update_API, updateData, ID);
        yield put(SpinnerState(false))
        yield put(updatePartySubPartySuccess(response))
    }
    catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}


function* PartySubPartysaga() {
    yield takeEvery(GET_PARTY_SUB_PARTY_LIST, getListGenFunc)
    yield takeEvery(POST_PARTY_SUB_PARTY, postGenFunc)
    yield takeEvery(EDIT_PARTY_SUB_PARTY, editGenFunc)
    yield takeEvery(EDIT_PARTY_SUB_PARTY_SUCCESS, updateGenFunc)
    yield takeEvery(DELETE_PARTY_SUB_PARTY, deleteGenFunc)
}

export default PartySubPartysaga;