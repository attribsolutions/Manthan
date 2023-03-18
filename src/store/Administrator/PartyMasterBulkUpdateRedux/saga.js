import { call, delay, put, takeEvery } from "redux-saga/effects";
import {
    postParty_Master_Bulk_Update_Success,
    GoButton_For_Party_Master_Bulk_Update_AddSuccess,
    postParty_for_dropdown_Success,
    postSelect_Field_for_dropdown_Success
} from "./actions";
import {
    PartyMasterBulkUpdate_GoButton_Post_API,
    Post_PartyMasterBulkUpdateAPI,
    post_PartyAPI,
    post_SelectFieldAPI
} from "../../../helpers/backend_helper";
import {
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_DROPDOWN,
    POST_SELECT_FIELD_DROPDOWN
} from "./actionTypes";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* GoButton_PartyMasterBulkUpdate_post_genfun({ jsonBody }) {

    try {
        const response = yield call(PartyMasterBulkUpdate_GoButton_Post_API, jsonBody);
        yield put(GoButton_For_Party_Master_Bulk_Update_AddSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* Post_PartyMasterBulkUpdate_GenratorFunction({ config }) {

    try {
        const response = yield call(Post_PartyMasterBulkUpdateAPI, config);
        yield put(postParty_Master_Bulk_Update_Success(response));
    } catch (error) { CommonConsole(error) }
}

function* Post_Party_GenratorFunction({ config }) {

    try {
        const response = yield call(post_PartyAPI, config);
        yield put(postParty_for_dropdown_Success(response));
    } catch (error) { CommonConsole(error) }
}

function* Post_SelectField_GenratorFunction({jsonBody}) {

    try {
        const response = yield call(post_SelectFieldAPI, jsonBody);
        yield put(postSelect_Field_for_dropdown_Success(response.Data));
    } catch (error) { CommonConsole(error) }
}


function* PartyMasterBulkUpdateSaga() {
    yield takeEvery(GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE, GoButton_PartyMasterBulkUpdate_post_genfun);
    yield takeEvery(POST_PARTY_MASTER_BULK_UPDATE_PAGE, Post_PartyMasterBulkUpdate_GenratorFunction);
    yield takeEvery(POST_PARTY_DROPDOWN, Post_Party_GenratorFunction);
    yield takeEvery(POST_SELECT_FIELD_DROPDOWN, Post_SelectField_GenratorFunction);
}

export default PartyMasterBulkUpdateSaga;

