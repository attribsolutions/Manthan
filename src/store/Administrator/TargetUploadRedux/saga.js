import { call, put, takeLatest } from "redux-saga/effects";
import {
  TargetUploadApiErrorAction,
  deleteTargetUploadSuccess,
  editTargetUploadIDSuccess,
  getTargetUploadListSuccess,
  saveTargetUploadMaster_Success,
} from "./action";
import {
  Delete_Target_Upload,
  Get_Target_Upload,
  del_Group_List_API,
  save_TargetUpload_API,
  view_Target_List_Api,
} from "../../../helpers/backend_helper";
import {
  DELETE_TARGET_UPLOAD_LIST_ID,
  EDIT_TARGET_UPLOAD_ID,
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
    const response = yield call(Get_Target_Upload);
    const NewResponse = response.Data.map(i => {
      const { SheetNo, ...rest } = i;
      return {
        ...rest,
        id: SheetNo
      };
    });

    debugger
    yield put(getTargetUploadListSuccess(NewResponse));
  } catch (error) { yield put(TargetUploadApiErrorAction()) }
}

function* Delete_TargetUpload_ID_GenFunc({ config }) {               // delete API
  const jsonBody = JSON.stringify({ "SheetNo": config.deleteId })
  config["jsonBody"] = jsonBody
  try {
    const response = yield call(Delete_Target_Upload, config);
    yield put(deleteTargetUploadSuccess(response))
  } catch (error) { yield put(TargetUploadApiErrorAction()) }
}


function* Edit_TargetUploadlist_ID_GenratorFunction({ config }) {          // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(view_Target_List_Api, config);
    response.pageMode = btnmode;
    yield put(editTargetUploadIDSuccess(response));
  } catch (error) { yield put(TargetUploadApiErrorAction()) }
}

function* TargetUploadSaga() {
  yield takeLatest(SAVE_TARGET_UPLOAD_MASTER, Save_Method_ForTargetUpload_GenFun)
  yield takeLatest(GET_TARGET_UPLOAD_LIST, Get_TargetUpload_List_GenFunc)
  yield takeLatest(DELETE_TARGET_UPLOAD_LIST_ID, Delete_TargetUpload_ID_GenFunc)
  yield takeLatest(EDIT_TARGET_UPLOAD_ID, Edit_TargetUploadlist_ID_GenratorFunction)

}

export default TargetUploadSaga;