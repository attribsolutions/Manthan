import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteModuleIDSuccess,
  editModuleIDSuccess,
  getModuleListSuccess,
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
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { AlertState } from "../../actions";

function* get_ModuleList_GenFun() { // get API
  try {
    const response = yield call(Module_Get_API);
    if (response.StatusCode === 200) {
      yield put(getModuleListSuccess(response.Data));
    }
    else {
      yield put(AlertState({
        Type: 4,
        Status: true, Message: response.Message,
      }));
    }
  } catch (error) { CommonConsole(error) }
}

function* save_Module_GenFun({ config = {} }) {  // Post API
  try {
    const response = yield call(Module_Post_API, config);
    yield put(saveModuleMasterSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* editModule_ID_GenFun({ config }) {//Edit API
  const { btnmode } = config; 
  try {
    const response = yield call(Module_Edit_API, config);
    response.pageMode = btnmode
    yield put(editModuleIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* update_Module_GenFun({ config }) { // Update API
  try {
    const response = yield call(Module_Update_API, config);
    yield put(updateModuleIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* delete_Module_ID_GenFun({ config }) { // Delete API
  try {
    const response = yield call(Module_Delete_API, config);
    yield put(deleteModuleIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* ModulesSaga() {
  yield takeEvery(SAVE_MODULE_MASTER, save_Module_GenFun);
  yield takeEvery(FETCH_MODULES_LIST, get_ModuleList_GenFun);
  yield takeEvery(EDIT_MODULE_ID, editModule_ID_GenFun);
  yield takeEvery(UPDATE_MODULE_ID, update_Module_GenFun);
  yield takeEvery(DELETE_MODULE_ID, delete_Module_ID_GenFun);
}

export default ModulesSaga;
