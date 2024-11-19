import { call, put, select, takeLatest } from "redux-saga/effects";
import {

    deletePartySubPartySuccess,
    editPartySubPartySuccess,
    getPartySubPartylistSuccess,
    getPartySubParty_For_party_dropdownSuccess,
    savePartySubPartySuccess,
    updatePartySubPartySuccess,
    PartySubPartyErrorAction,
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
    DELETE_ID_FOR_MASTER_PAGE,

} from "./actionType"

function* Save_Method_ForPartySubParty_GenFun({ config }) {                     //Save API 
    try {
        const response = yield call(PartySubParty_Post_API, config);
        yield put(savePartySubPartySuccess(response));
    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* Get_PartySubParty_List_GenFunc() {                                   //get List API                         
    try {
        const response = yield call(PartySubParty_Get_API);
        const updatedData = response.Data.map((i) => ({ ...i, id: i.Party_id }))
        yield put(getPartySubPartylistSuccess(updatedData));
    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* Delete_PartySubParty_ID_GenFunc({ config }) {                             //Delete API
    try {
        const response = yield call(PartySubParty_Delete_API, config);
        yield put(deletePartySubPartySuccess(response))
    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* Edit_PartySubParty_ID_GenFunc({ config }) {                       //Edit API
    const { btnmode } = config;
    try {
        const response = yield call(PartySubParty_Edit_API, config);
        response.pageMode = btnmode;
        yield put(editPartySubPartySuccess(response));
    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* Update_PartySubParty_ID_GenFunc({ config }) {                     //Update API
    try {
        const response = yield call(PartySubParty_Update_API, config);
        yield put(updatePartySubPartySuccess(response))
    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* getPartySubPartyGenFunc({ id }) {                                        // get API
    try {
        const response = yield call(PartySubParty_Dropdown_Get_API, id);
        const newArr = response.Data.map((i, k) => {
            i.id = k
            return i
        })
        yield put(getPartySubParty_For_party_dropdownSuccess(newArr));
    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* deletePartySubPartyGenFunc({ id }) {
    const getState = (state) => state.PartySubPartyReducer.PartySubParty;
    const tableList = yield select(getState);
    const newList = tableList.filter((index) => {
        return (!(index.SubParty === id))
    })
    try {
        yield put(getPartySubParty_For_party_dropdownSuccess(newList));

    } catch (error) { yield put(PartySubPartyErrorAction()) }
}

function* PartySubPartysaga() {
    yield takeLatest(GET_PARTY_SUB_PARTY_LIST, Get_PartySubParty_List_GenFunc)
    yield takeLatest(SAVE_PARTY_SUB_PARTY, Save_Method_ForPartySubParty_GenFun)
    yield takeLatest(EDIT_PARTY_SUB_PARTY, Edit_PartySubParty_ID_GenFunc)
    yield takeLatest(UPDATE_PARTY_SUB_PARTY, Update_PartySubParty_ID_GenFunc)
    yield takeLatest(DELETE_PARTY_SUB_PARTY, Delete_PartySubParty_ID_GenFunc)
    yield takeLatest(GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN, getPartySubPartyGenFunc)
    yield takeLatest(DELETE_ID_FOR_MASTER_PAGE, deletePartySubPartyGenFunc)
}

export default PartySubPartysaga;