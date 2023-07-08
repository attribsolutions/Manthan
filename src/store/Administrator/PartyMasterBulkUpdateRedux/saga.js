import { call, put, takeLatest } from "redux-saga/effects";
import {
    postParty_Master_Bulk_Update_Success,
    GoButton_For_Party_Master_Bulk_Update_AddSuccess,
    postPartyName_for_dropdown_Success,
    postSelect_Field_for_dropdown_Success,
    updatePartyMasterBulkIDSuccess,
    PartyBulkApiErrorAction
} from "./actions";
import {
    PartyMasterBulkUpdate_GoButton_Post_API,
    Post_PartyMasterBulkUpdateAPI,
    post_PartyAPI,
    post_SelectFieldAPI,
    Update_Party_Bulk,
} from "../../../helpers/backend_helper";
import {
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_NAME_DROPDOWN,
    POST_SELECT_FIELD_DROPDOWN,
    UPDATE_PARTY_MASTER_BULK
} from "./actionTypes";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* GoButton_PartyMasterBulkUpdate_post_genfun({ jsonBody }) {

    try {
        const response = yield call(PartyMasterBulkUpdate_GoButton_Post_API, jsonBody);
        yield put(GoButton_For_Party_Master_Bulk_Update_AddSuccess(response.Data));
    } catch (error) { yield put(PartyBulkApiErrorAction()) }
}



function* Post_PartyMasterBulkUpdate_GenratorFunction({ config }) {

    try {
        const response = yield call(Post_PartyMasterBulkUpdateAPI, config);
        yield put(postParty_Master_Bulk_Update_Success(response));
    } catch (error) { yield put(PartyBulkApiErrorAction()) }
}

function* Post_Party_GenratorFunction({ jsonBody }) {

    try {
        const response = yield call(post_PartyAPI, jsonBody);
        yield put(postPartyName_for_dropdown_Success(response.Data));
    } catch (error) { yield put(PartyBulkApiErrorAction()) }
}

function* Post_SelectField_GenratorFunction({ jsonBody }) {

    try {
        const response = yield call(post_SelectFieldAPI, jsonBody);
        yield put(postSelect_Field_for_dropdown_Success(response.Data));
    } catch (error) { yield put(PartyBulkApiErrorAction()) }
}

function* Update_Party_Bulk_GenratorFunction({ updateData, id }) {
    try {
        const response = yield call(Update_Party_Bulk, updateData, id);
        yield put(updatePartyMasterBulkIDSuccess(response))
    } catch (error) { yield put(PartyBulkApiErrorAction()) }
}


function* PartyMasterBulkUpdateSaga() {
    yield takeLatest(GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE, GoButton_PartyMasterBulkUpdate_post_genfun);
    yield takeLatest(POST_PARTY_MASTER_BULK_UPDATE_PAGE, Post_PartyMasterBulkUpdate_GenratorFunction);
    yield takeLatest(POST_PARTY_NAME_DROPDOWN, Post_Party_GenratorFunction);
    yield takeLatest(POST_SELECT_FIELD_DROPDOWN, Post_SelectField_GenratorFunction);
    yield takeLatest(UPDATE_PARTY_MASTER_BULK, Update_Party_Bulk_GenratorFunction);
}

export default PartyMasterBulkUpdateSaga;

