import { call, put, takeEvery } from "redux-saga/effects";
import {
    deletePartySubPartySuccess,
    editPartySubPartySuccess,
    getPartySubPartylistSuccess,
    getPartySubParty_For_party_dropdownSuccess,
    savePartySubPartySuccess,
    updatePartySubPartySuccess,
} from "./action";

import {
    PartySubParty_Delete_API,
    PartySubParty_Dropdown_Get_API,
    PartySubParty_Edit_API,
    PartySubParty_Get_API,
    PartySubParty_Post_API,
    PartySubParty_Update_API,
} from "../../../helpers/backend_helper";

import {
    DELETE_PARTY_SUB_PARTY,
    EDIT_PARTY_SUB_PARTY,
    UPDATE_PARTY_SUB_PARTY,
    GET_PARTY_SUB_PARTY_LIST,
    SAVE_PARTY_SUB_PARTY,
    GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN,

} from "./actionType"

import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


function* Save_Method_ForPartySubParty_GenFun({ config }) {                     //Save API 
    try {
        const response = yield call(PartySubParty_Post_API, config);
        yield put(savePartySubPartySuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Get_PartySubParty_List_GenFunc() {                                   //get List API                         
    try {
        const response = yield call(PartySubParty_Get_API);
        yield put(getPartySubPartylistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}


function* Delete_PartySubParty_ID_GenFunc({ config }) {                             //Delete API
    try {
        const response = yield call(PartySubParty_Delete_API, config);
        yield put(deletePartySubPartySuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* Edit_PartySubParty_ID_GenFunc({ config }) {                       //Edit API
    const { btnmode } = config;
    try {
        const response = yield call(PartySubParty_Edit_API, config);
        response.pageMode = btnmode;
        yield put(editPartySubPartySuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* Update_PartySubParty_ID_GenFunc({ config }) {                     //Update API
    try {
        const response = yield call(PartySubParty_Update_API, config );
        yield put(updatePartySubPartySuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* getPartySubPartyGenFunc({ id }) {                                        // get API
    try {
        const response = yield call(PartySubParty_Dropdown_Get_API, id);
        yield put(getPartySubParty_For_party_dropdownSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* PartySubPartysaga() {
    yield takeEvery(GET_PARTY_SUB_PARTY_LIST, Get_PartySubParty_List_GenFunc)
    yield takeEvery(SAVE_PARTY_SUB_PARTY, Save_Method_ForPartySubParty_GenFun)
    yield takeEvery(EDIT_PARTY_SUB_PARTY, Edit_PartySubParty_ID_GenFunc)
    yield takeEvery(UPDATE_PARTY_SUB_PARTY, Update_PartySubParty_ID_GenFunc)
    yield takeEvery(DELETE_PARTY_SUB_PARTY, Delete_PartySubParty_ID_GenFunc)
    yield takeEvery(GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN, getPartySubPartyGenFunc)
}

export default PartySubPartysaga;