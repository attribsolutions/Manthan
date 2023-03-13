import { call, put, takeEvery } from "redux-saga/effects";
import {
  CommonConsole,
  loginJsonBody
} from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  detelet_PartyType_List_Api,
  edit_PartyType_List_Api,
  get_PartyType_List_Api,
  Save_Party_Type_API,
  update_PartyType_List_Api
} from "../../../helpers/backend_helper";

import * as action from "./action";
import * as actionType from "./actionTypes";

// post api
function* save_Party_Type_GneFunc({ config }) {
  try {
    const response = yield call(Save_Party_Type_API, config);
    yield put(action.SavePartyTypeAPISuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get api
function* Get_PartyType_List_GneFunc() {
  try {
    const jsonBody = { ...loginJsonBody(), "id": 0 }
    const response = yield call(get_PartyType_List_Api, jsonBody);
    yield put(action.getPartyTypelistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_PartyType_ID_GneFunc({ config }) {
  try {
    const response = yield call(detelet_PartyType_List_Api, config);
    yield put(action.deletePartyTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_PartyType_ID_GneFunc({ config }) {
  const { btnmode, editId } = config;
  const body = { ...loginJsonBody(), "id": editId };
  config.jsonBody = body;
  try {
    const response = yield call(edit_PartyType_List_Api, config);
    response.pageMode = btnmode
    yield put(action.editPartyTypeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_PartyType_ID_GneFunc({config }) {

  try {
    const response = yield call(update_PartyType_List_Api, config);
    yield put(action.updatePartyTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* PartyTypeSaga() {
  yield takeEvery(actionType.SAVE_PARTY_TYPE_API, save_Party_Type_GneFunc)
  yield takeEvery(actionType.GET_PARTY_TYPE_LIST, Get_PartyType_List_GneFunc)
  yield takeEvery(actionType.DELETE_PARTY_TYPE_ID, Delete_PartyType_ID_GneFunc)
  yield takeEvery(actionType.EDIT_PARTY_TYPE_ID, Edit_PartyType_ID_GneFunc)
  yield takeEvery(actionType.UPDATE_PARTY_TYPE_ID, Update_PartyType_ID_GneFunc)

}

export default PartyTypeSaga;