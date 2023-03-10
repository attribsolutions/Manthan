import { call, put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
    deletePartySubPartySuccess,
    editPartySubPartySuccess,
    getPartySubPartylistSuccess,
    getPartySubParty_For_party_dropdownSuccess,
    postPartySubPartySuccess,
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
    POST_PARTY_SUB_PARTY,
    GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN,

} from "./actionType"

import { AlertState } from "../../actions";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* getListGenFunc() {

    try {
        const response = yield call(PartySubParty_Get_API);
        // const data = response.Data.map((index) => ({
        //     StateId: index.State.id,
        //     State: index.State.Name,
        //     DistrictId: index.District.id,
        //     District: index.District.Name,
        //     CompanyId: index.Company.id,
        //     Company: index.Company.Name,
        //     PartyTypeId: index.PartyType.id,
        //     PartyTypeName: index.PartyType.Name,
        //     PriceListId: index.PriceList.id,
        //     PriceListName: index.PriceList.Name,
        //     SubPartyId: index.SubParty.id,
        //     SubPartyName: index.SubParty.Name,
        //     Name: index.Name,
        //     Email: index.Email,
        //     MobileNo: index.MobileNo,
        //     AlternateContactNo: index.AlternateContactNo,
        //     GSTIN: index.GSTIN,
        //     PAN: index.PAN,
        //     IsDivision: index.IsDivision,
        //     MkUpMkDn: index.MkUpMkDn,
        //     isActive: index.isActive,
        //     id: index.id
        // }));
        // yield put(getPartySubPartylistSuccess(data));
        // console.log("response in saga", response)
        yield put(getPartySubPartylistSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* postGenFunc({ data }) {
    try {
        const response = yield call(PartySubParty_Post_API, data);
        yield put(postPartySubPartySuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* deleteGenFunc({ id }) {
    try {
        const response = yield call(PartySubParty_Delete_API, id);
        yield put(deletePartySubPartySuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* editGenFunc({ id, pageMode }) {
    try {
        const response = yield call(PartySubParty_Edit_API, id);
        response.pageMode = pageMode
        yield put(editPartySubPartySuccess(response));
    } catch (error) { CommonConsole(error) }
}

function* updateGenFunc({ updateData, ID }) {
    try {
        const response = yield call(PartySubParty_Update_API, updateData, ID);
        yield put(updatePartySubPartySuccess(response))
    } catch (error) { CommonConsole(error) }
}

function* getPartySubPartyGenFunc({ id }) {
    try {
        const response = yield call(PartySubParty_Dropdown_Get_API, id);
        yield put(getPartySubParty_For_party_dropdownSuccess(response.Data));
    } catch (error) { CommonConsole(error) }
}

function* PartySubPartysaga() {
    yield takeEvery(GET_PARTY_SUB_PARTY_LIST, getListGenFunc)
    yield takeEvery(POST_PARTY_SUB_PARTY, postGenFunc)
    yield takeEvery(EDIT_PARTY_SUB_PARTY, editGenFunc)
    yield takeEvery(UPDATE_PARTY_SUB_PARTY, updateGenFunc)
    yield takeEvery(DELETE_PARTY_SUB_PARTY, deleteGenFunc)
    yield takeEvery(GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN, getPartySubPartyGenFunc)
}

export default PartySubPartysaga;