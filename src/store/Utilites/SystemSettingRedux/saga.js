import { call, put, takeLatest } from "redux-saga/effects";
import {
  SystemSettingApiErrorAction,
  deleteSystemSettingSuccess,
  editSystemSettingIDSuccess,
  saveSystemSettingMaster_Success,
  updateSystemSettingIDSuccess,
} from "./action";
import {
  del_SystemSetting_List_API,
  edit_SystemSetting_List_Api,
  save_SystemSetting_API,
  update_SystemSetting_List_Api,
} from "../../../helpers/backend_helper";
import {
  DELETE_SYSTEM_SETTING_LIST_ID,
  EDIT_SYSTEM_SETTING_ID,
  SAVE_SYSTEM_SETTING,
  UPDATE_SYSTEM_SETTING_ID,
} from "./actionType";

function* Save_Method_ForSystemSetting_GenFun({ config }) {
  try {
    const response = yield call(save_SystemSetting_API, config);
    yield put(saveSystemSettingMaster_Success(response));
  } catch (error) { yield put(SystemSettingApiErrorAction()) }
}


function* Delete_SystemSetting_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_SystemSetting_List_API, config);
    yield put(deleteSystemSettingSuccess(response))
  } catch (error) { yield put(SystemSettingApiErrorAction()) }
}

function* Edit_SystemSetting_ID_GenFunc({ config }) {
                    // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_SystemSetting_List_Api, config);
    response.pageMode = btnmode;
    yield put(editSystemSettingIDSuccess(response));
  } catch (error) { yield put(SystemSettingApiErrorAction()) }
}

function* Update_SystemSetting_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_SystemSetting_List_Api, config);
    yield put(updateSystemSettingIDSuccess(response))
  } catch (error) { yield put(SystemSettingApiErrorAction()) }
}

function* SystemSettingSaga() {
  yield takeLatest(SAVE_SYSTEM_SETTING, Save_Method_ForSystemSetting_GenFun)
  yield takeLatest(DELETE_SYSTEM_SETTING_LIST_ID, Delete_SystemSetting_ID_GenFunc)
  yield takeLatest(EDIT_SYSTEM_SETTING_ID, Edit_SystemSetting_ID_GenFunc)
  yield takeLatest(UPDATE_SYSTEM_SETTING_ID, Update_SystemSetting_ID_GenFunc)
}

export default SystemSettingSaga;