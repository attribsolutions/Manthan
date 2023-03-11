import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  detelet_PartyType_List_Api,
  edit_PartyType_List_Api,
  get_PartyType_List_Api,
  Save_Party_Type_API,
  update_PartyType_List_Api
} from "../../../helpers/backend_helper";
import {
  deletePartyTypeIDSuccess,
  editPartyTypeSuccess,
  getPartyTypelistSuccess,
  PostPartyTypeAPISuccess,
  updatePartyTypeIDSuccess
} from "./action";
import {
  DELETE_PARTY_TYPE_ID,
  EDIT_PARTY_TYPE_ID, GET_PARTY_TYPE_LIST,
  POST_PARTY_TYPE_API,
  UPDATE_PARTY_TYPE_ID
} from "./actionTypes";

// post api
function* Post_Party_Type_GneratorFunction({ data }) {
  try {
    const response = yield call(Save_Party_Type_API, data);
    yield put(PostPartyTypeAPISuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get api
function* Get_PartyType_List_GenratorFunction() {
  try {
    const jsonBody = { ...loginJsonBody(), "id": 0 }
    const response = yield call(get_PartyType_List_Api, jsonBody);
    yield put(getPartyTypelistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_PartyType_ID_GenratorFunction({ config }) {
  try {
    const response = yield call(detelet_PartyType_List_Api, config);
    yield put(deletePartyTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_PartyType_ID_GenratorFunction({ config }) {
  const { btnmode, editId } = config;
  const body = { ...loginJsonBody(), "id": editId };
  config.jsonBody = body;
  try {
    const response = yield call(edit_PartyType_List_Api, config);
    response.pageMode = btnmode
    yield put(editPartyTypeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_PartyType_ID_GenratorFunction({ updateData, ID }) {

  try {
    const response = yield call(update_PartyType_List_Api, updateData, ID);
    yield put(updatePartyTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* PartyTypeSaga() {
  yield takeEvery(POST_PARTY_TYPE_API, Post_Party_Type_GneratorFunction)
  yield takeEvery(GET_PARTY_TYPE_LIST, Get_PartyType_List_GenratorFunction)
  yield takeEvery(DELETE_PARTY_TYPE_ID, Delete_PartyType_ID_GenratorFunction)
  yield takeEvery(EDIT_PARTY_TYPE_ID, Edit_PartyType_ID_GenratorFunction)
  yield takeEvery(UPDATE_PARTY_TYPE_ID, Update_PartyType_ID_GenratorFunction)

}

export default PartyTypeSaga;