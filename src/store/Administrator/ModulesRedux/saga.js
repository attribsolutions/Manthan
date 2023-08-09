import { call, put, takeLatest } from "redux-saga/effects";
import {
  deleteModuleIDSuccess,
  editModuleIDSuccess,
  getModuleListSuccess,
  moduleApiErrorAction,
  saveModuleMasterSuccess,
  updateModuleIDSuccess
} from "./actions";
import {
  Module_Delete_API,
  Module_Edit_API,
  Module_Get_API,
  Module_Post_API,
  Module_Update_API
} from "../../../helpers/backend_helper";
import {
  DELETE_MODULE_ID,
  EDIT_MODULE_ID,
  FETCH_MODULES_LIST,
  SAVE_MODULE_MASTER,
  UPDATE_MODULE_ID
} from "./actionType";

function* get_ModuleList_GenFun() { // get API
  try {
    const response = yield call(Module_Get_API);

    yield put(getModuleListSuccess(response.Data));
  } catch (error) { yield put(moduleApiErrorAction()) }
}

function* save_Module_GenFun({ config }) {  // Post API
  try {
    const response = yield call(Module_Post_API, config);
    yield put(saveModuleMasterSuccess(response));
  } catch (error) { yield put(moduleApiErrorAction()) }
}

function* editModule_ID_GenFun({ config }) {//Edit API
  const { btnmode } = config;
  try {
    const response = yield call(Module_Edit_API, config);
    response.pageMode = btnmode
    yield put(editModuleIDSuccess(response));
  } catch (error) { yield put(moduleApiErrorAction()) }
}

function* update_Module_GenFun({ config }) { // Update API
  try {
    const response = yield call(Module_Update_API, config);
    yield put(updateModuleIDSuccess(response))
  } catch (error) { yield put(moduleApiErrorAction()) }
}

function* delete_Module_ID_GenFun({ config }) { // Delete API
  try {
    const response = yield call(Module_Delete_API, config);
    yield put(deleteModuleIDSuccess(response))
  } catch (error) { yield put(moduleApiErrorAction()) }
}

function* ModulesSaga() {
  yield takeLatest(SAVE_MODULE_MASTER, save_Module_GenFun);
  yield takeLatest(FETCH_MODULES_LIST, get_ModuleList_GenFun);
  yield takeLatest(EDIT_MODULE_ID, editModule_ID_GenFun);
  yield takeLatest(UPDATE_MODULE_ID, update_Module_GenFun);
  yield takeLatest(DELETE_MODULE_ID, delete_Module_ID_GenFun);
}

export default ModulesSaga;
