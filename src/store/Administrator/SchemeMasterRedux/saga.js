import { call, put, takeLatest } from "redux-saga/effects";
import {
  SchemeApiErrorAction,
  deleteSchemelistSuccess,
  editSchemeIDSuccess,
  getSchemeListSuccess,
  saveSchemeMaster_Success,
  updateSchemeIDSuccess
} from "./action";
import {
  del_Scheme_List_API,
  edit_Scheme_List_Api,
  Get_Scheme_List,
  save_Scheme_API,
  update_Scheme_List_Api
} from "../../../helpers/backend_helper";
import {
  DELETE_SCHEME_LIST_ID,
  EDIT_SCHEMEMASTER_ID,
  GET_SCHEME_LIST,
  SAVE_SCHEME_MASTER,
  UPDATE_SCHEMEMASTER_ID
} from "./actionType";

function* Save_Method_ForSchemeMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(save_Scheme_API, config);
    yield put(saveSchemeMaster_Success(response));
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Get_Scheme_List_GenFunc() {                                   // getList API
  try {
    const response = yield call(Get_Scheme_List);
    debugger
    yield put(getSchemeListSuccess(response.Data));
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Delete_SchemeList_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_Scheme_List_API, config);
    yield put(deleteSchemelistSuccess(response))
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Edit_Schemelist_ID_GenFunc({ config }) {                      // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_Scheme_List_Api, config);
    response.pageMode = btnmode;
    yield put(editSchemeIDSuccess(response));
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* Update_Schemelist_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_Scheme_List_Api, config);
    yield put(updateSchemeIDSuccess(response))
  } catch (error) { yield put(SchemeApiErrorAction()) }
}

function* SchemeSaga() {
  yield takeLatest(SAVE_SCHEME_MASTER, Save_Method_ForSchemeMaster_GenFun)
  yield takeLatest(GET_SCHEME_LIST, Get_Scheme_List_GenFunc)
  yield takeLatest(DELETE_SCHEME_LIST_ID, Delete_SchemeList_ID_GenFunc)
  yield takeLatest(EDIT_SCHEMEMASTER_ID, Edit_Schemelist_ID_GenFunc)
  yield takeLatest(UPDATE_SCHEMEMASTER_ID, Update_Schemelist_ID_GenFunc)
}

export default SchemeSaga;