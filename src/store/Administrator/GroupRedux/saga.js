import { call, put, takeLatest } from "redux-saga/effects";
import {
  GroupApiErrorAction,
  deleteGrouplistSuccess,
  editGroupIDSuccess,
  getGroupListSuccess,
  saveGroupMaster_Success,
  updateGroupIDSuccess
} from "./action";
import {
  del_Group_List_API,
  edit_Group_List_Api,
  get_Group_List_Api,
  save_Group_API,
  update_Group_List_Api
} from "../../../helpers/backend_helper";
import {
  DELETE_GROUP_LIST_ID,
  EDIT_GROUPMASTER_ID,
  GET_GROUP_LIST,
  SAVE_GROUP_MASTER,
  UPDATE_GROUPMASTER_ID
} from "./actionType";

function* Save_Method_ForGroupMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(save_Group_API, config);
    yield put(saveGroupMaster_Success(response));
  } catch (error) { yield put(GroupApiErrorAction()) }
}

function* Get_Group_List_GenFunc() {                                   // getList API
  try {
    const response = yield call(get_Group_List_Api);
    yield put(getGroupListSuccess(response.Data));
  } catch (error) { yield put(GroupApiErrorAction()) }
}

function* Delete_GroupList_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_Group_List_API, config);
    yield put(deleteGrouplistSuccess(response))
  } catch (error) { yield put(GroupApiErrorAction()) }
}

function* Edit_Grouplist_ID_GenFunc({ config }) {                      // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_Group_List_Api, config);
    response.pageMode = btnmode;
    yield put(editGroupIDSuccess(response));
  } catch (error) { yield put(GroupApiErrorAction()) }
}

function* Update_Grouplist_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_Group_List_Api, config);
    yield put(updateGroupIDSuccess(response))
  } catch (error) { yield put(GroupApiErrorAction()) }
}

function* GroupSaga() {
  yield takeLatest(SAVE_GROUP_MASTER, Save_Method_ForGroupMaster_GenFun)
  yield takeLatest(GET_GROUP_LIST, Get_Group_List_GenFunc)
  yield takeLatest(DELETE_GROUP_LIST_ID, Delete_GroupList_ID_GenFunc)
  yield takeLatest(EDIT_GROUPMASTER_ID, Edit_Grouplist_ID_GenFunc)
  yield takeLatest(UPDATE_GROUPMASTER_ID, Update_Grouplist_ID_GenFunc)
}

export default GroupSaga;