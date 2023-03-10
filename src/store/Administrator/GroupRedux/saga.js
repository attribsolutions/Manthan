import { call, put, takeEvery } from "redux-saga/effects";
import {
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
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


function* Save_Method_ForGroupMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(save_Group_API, config);
    yield put(saveGroupMaster_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* Get_Group_List_genFunc() {                                   // getList API
  try {
    const response = yield call(get_Group_List_Api);
    yield put(getGroupListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Delete_GroupList_ID_genFunc({ config }) {                    // delete API
  try {
    const response = yield call(del_Group_List_API, config);
    yield put(deleteGrouplistSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_Grouplist_ID_genFunc({ config }) {                      // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_Group_List_Api, config);
    response.pageMode = btnmode;
    yield put(editGroupIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Update_Grouplist_ID_genFunc({ config }) {                    // update API
  try {
    const response = yield call(update_Group_List_Api, config);
    yield put(updateGroupIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* GroupSaga() {
  yield takeEvery(SAVE_GROUP_MASTER, Save_Method_ForGroupMaster_GenFun)
  yield takeEvery(GET_GROUP_LIST, Get_Group_List_genFunc)
  yield takeEvery(DELETE_GROUP_LIST_ID, Delete_GroupList_ID_genFunc)
  yield takeEvery(EDIT_GROUPMASTER_ID, Edit_Grouplist_ID_genFunc)
  yield takeEvery(UPDATE_GROUPMASTER_ID, Update_Grouplist_ID_genFunc)
}

export default GroupSaga;