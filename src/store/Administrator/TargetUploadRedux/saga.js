import { call, put, takeLatest } from "redux-saga/effects";
import {
  TargetUploadApiErrorAction,
  deleteTargetUploadSuccess,
  getTargetUploadListSuccess,
  saveTargetUploadMaster_Success,
} from "./action";
import {
  del_Group_List_API,
  get_Group_List_Api,
  save_Group_API,
  save_TargetUpload_API,
} from "../../../helpers/backend_helper";
import {
  DELETE_TARGET_UPLOAD_LIST_ID,
  GET_TARGET_UPLOAD_LIST,
  SAVE_TARGET_UPLOAD_MASTER,
} from "./actionType";

function* Save_Method_ForTargetUpload_GenFun({ config }) {              // Save API
  try {
    const response = yield call(save_TargetUpload_API, config);
    yield put(saveTargetUploadMaster_Success(response));
  } catch (error) { yield put(TargetUploadApiErrorAction()) }
}

function* Get_TargetUpload_List_GenFunc() {                                   // getList API
  try {
    const response = yield call(get_Group_List_Api);
    yield put(getTargetUploadListSuccess(response.Data));
  } catch (error) { yield put(TargetUploadApiErrorAction()) }
}

function* Delete_TargetUpload_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_Group_List_API, config);
    yield put(deleteTargetUploadSuccess(response))
  } catch (error) { yield put(TargetUploadApiErrorAction()) }
}

function* TargetUploadSaga() {
  yield takeLatest(SAVE_TARGET_UPLOAD_MASTER, Save_Method_ForTargetUpload_GenFun)
  yield takeLatest(GET_TARGET_UPLOAD_LIST, Get_TargetUpload_List_GenFunc)
  yield takeLatest(DELETE_TARGET_UPLOAD_LIST_ID, Delete_TargetUpload_ID_GenFunc)

}

export default TargetUploadSaga;