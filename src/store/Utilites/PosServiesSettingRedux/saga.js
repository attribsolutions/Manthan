import { call, put, takeLatest } from "redux-saga/effects";
import {
  PosServiceSettingApiErrorAction,
  deletePosServiceSettingSuccess,
  editPosServiceSettingIDSuccess,
  getPosServiceSettingSuccess,
  savePosServiceSettingMaster_Success,
  updatePosServiceSettingIDSuccess,


} from "./action";
import {
  del_PosServiceSetting_List_API,
  edit_PosServiceSetting_List_Api,
  get_PosServiceSetting_List_Api,
  save_PosServiceSetting_API,
  update_PosServiceSetting_List_Api,
} from "../../../helpers/backend_helper";
import {
  DELETE_POS_SERVICE_SETTING_LIST_ID,
  EDIT_POS_SERVICE_SETTING_ID,
  SAVE_POS_SERVICE_SETTING,
  UPDATE_POS_SERVICE_SETTING_ID,
  GET_POS_SERVICE_SETTING_LIST,
} from "./actionType";

function* Save_Method_ForPosServiceSetting_GenFun({ config }) {

  try {
    const response = yield call(save_PosServiceSetting_API, config);

    yield put(savePosServiceSettingMaster_Success(response));

  } catch (error) { yield put(PosServiceSettingApiErrorAction()) }

}


function* Get_PosServiceSetting_Genrator() {
  try {
    const response = yield call(get_PosServiceSetting_List_Api);  // get Liat

    yield put(getPosServiceSettingSuccess(response.Data));
  } catch (error) {
    yield put(PosServiceSettingApiErrorAction());
  }

}


function* Delete_PosServiceSetting_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_PosServiceSetting_List_API, config);
    yield put(deletePosServiceSettingSuccess(response))
  } catch (error) { yield put(PosServiceSettingApiErrorAction()) }
}

function* Edit_PosServiceSetting_ID_GenFunc({ config }) {
  debugger
  const { btnmode } = config;
  try {
    const response = yield call(edit_PosServiceSetting_List_Api, config);
    response.pageMode = btnmode;
    yield put(editPosServiceSettingIDSuccess(response));
  } catch (error) { yield put(PosServiceSettingApiErrorAction()) }
}

function* Update_PosServiceSetting_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_PosServiceSetting_List_Api, config);
    yield put(updatePosServiceSettingIDSuccess(response))
  } catch (error) { yield put(PosServiceSettingApiErrorAction()) }
}

function* PosServiceSettingSaga() {
  yield takeLatest(SAVE_POS_SERVICE_SETTING, Save_Method_ForPosServiceSetting_GenFun)
  yield takeLatest(DELETE_POS_SERVICE_SETTING_LIST_ID, Delete_PosServiceSetting_ID_GenFunc)
  yield takeLatest(EDIT_POS_SERVICE_SETTING_ID, Edit_PosServiceSetting_ID_GenFunc)
  yield takeLatest(UPDATE_POS_SERVICE_SETTING_ID, Update_PosServiceSetting_ID_GenFunc)
  yield takeLatest(GET_POS_SERVICE_SETTING_LIST, Get_PosServiceSetting_Genrator)
}

export default PosServiceSettingSaga;