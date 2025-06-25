import { call, put, takeLatest } from "redux-saga/effects";
import {
    PhonePaySettingApiErrorAction,
    deletePhonePaySettingSuccess,
    editPhonePaySettingIDSuccess,
  getPhonePaySettingIDSuccess,
  savePhonePaySettingMaster_Success,
  updatePhonePaySettingIDSuccess,
  

} from "./action";
import {
  del_PhonePaySetting_List_API,
  edit_PhonePaySetting_List_Api,
  get_PhonePaySetting_List_Api,
  save_PhonePaySetting_API,
  update_PhonePaySetting_List_Api,
} from "../../../helpers/backend_helper";
import {
  DELETE_PHONE_PAY_SETTING_LIST_ID,
  EDIT_PHONE_PAY_SETTING_ID,
  SAVE_PHONE_PAY_SETTING,
  UPDATE_PHONE_PAY_SETTING_ID,
  GET_PHONE_PAY_SETTING_LIST_ID,
  GET_PHONE_PAY_SETTING_LIST_ID_SUCCESS,
} from "./actionType";

function* Save_Method_ForPhonePaySetting_GenFun({ config }) {
  debugger
  try {
    const response = yield call(save_PhonePaySetting_API, config);
    yield put(savePhonePaySettingMaster_Success(response));
    debugger
  } catch (error) { yield put(PhonePaySettingApiErrorAction()) }
}


function* Get_PhonePaySetting_Genrator() {                    // getList API
  try {
    const response = yield call(get_PhonePaySetting_List_Api);
    yield put(getPhonePaySettingIDSuccess(response.Data));
  } catch (error) { yield put(PhonePaySettingApiErrorAction()) }
}


function* Delete_PhonePaySetting_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_PhonePaySetting_List_API, config);
    yield put(deletePhonePaySettingSuccess(response))
  } catch (error) { yield put(PhonePaySettingApiErrorAction()) }
}

function* Edit_PhonePaySetting_ID_GenFunc({ config }) {
                    // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_PhonePaySetting_List_Api, config);
    response.pageMode = btnmode;
    yield put(editPhonePaySettingIDSuccess(response));
  } catch (error) { yield put(PhonePaySettingApiErrorAction()) }
}

function* Update_PhonePaySetting_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_PhonePaySetting_List_Api, config);
    yield put(updatePhonePaySettingIDSuccess(response))
  } catch (error) { yield put(PhonePaySettingApiErrorAction()) }
}

function* PhonePaySettingSaga() {
  yield takeLatest(SAVE_PHONE_PAY_SETTING, Save_Method_ForPhonePaySetting_GenFun)
  yield takeLatest(DELETE_PHONE_PAY_SETTING_LIST_ID, Delete_PhonePaySetting_ID_GenFunc)
  yield takeLatest(EDIT_PHONE_PAY_SETTING_ID, Edit_PhonePaySetting_ID_GenFunc)
  yield takeLatest(UPDATE_PHONE_PAY_SETTING_ID, Update_PhonePaySetting_ID_GenFunc)
  yield takeLatest(GET_PHONE_PAY_SETTING_LIST_ID, Get_PhonePaySetting_Genrator)
}

export default PhonePaySettingSaga;