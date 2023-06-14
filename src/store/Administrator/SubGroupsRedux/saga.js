import { call, put, takeEvery } from "redux-saga/effects";
import {
  SubGroupApiErrorAction,
  deleteSubGrouplistSuccess,
  editSubGroupIDSuccess,
  getSubGroupListSuccess,
  saveSubGroupSuccess,
  updateSubgroupIDSuccess
} from "./action";
import {
  del_SubGroup_List_API,
  edit_SubGroup_List_Api,
  get_SubGroup_List_Api,
  Post_SubGroupList_API,
  update_SubGroup_List_Api
} from "../../../helpers/backend_helper";
import {
  DELETE_SUBGROUP_LIST_ID,
  EDIT_SUBGROUPMASTER_ID,
  GET_SUBGROUP_LIST,
  SAVE_SUBGROUPLIST,
  UPDATE_SUBGROUPMASTER_ID
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* save_Method_ForSubGroupMaster_GenFun({ config }) {          // Save API
  try {
    const response = yield call(Post_SubGroupList_API, config);
    yield put(saveSubGroupSuccess(response));
  } catch (error) { yield put(SubGroupApiErrorAction()) }

}

function* Get_SubGroup_List_genFunc() {                             // getList API
  try {
    const response = yield call(get_SubGroup_List_Api);
    yield put(getSubGroupListSuccess(response.Data));
  } catch (error) { yield put(SubGroupApiErrorAction()) }
}

function* Delete_SubGroupList_ID_GenratorFunction({ config }) {        // delete API
  try {
    const response = yield call(del_SubGroup_List_API, config);
    yield put(deleteSubGrouplistSuccess(response))
  } catch (error) { yield put(SubGroupApiErrorAction()) }
}

function* Edit_SubGrouplist_ID_GenratorFunction({ config }) {          // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_SubGroup_List_Api, config);
    response.pageMode = btnmode;
    yield put(editSubGroupIDSuccess(response));
  } catch (error) { yield put(SubGroupApiErrorAction()) }
}

function* Update_SubGrouplist_ID_GenratorFunction({ config }) {        // update API
  try {
    const response = yield call(update_SubGroup_List_Api, config);
    yield put(updateSubgroupIDSuccess(response))
  } catch (error) { yield put(SubGroupApiErrorAction()) }
}

function* SubGroupSaga() {
  yield takeEvery(SAVE_SUBGROUPLIST, save_Method_ForSubGroupMaster_GenFun)
  yield takeEvery(GET_SUBGROUP_LIST, Get_SubGroup_List_genFunc)
  yield takeEvery(DELETE_SUBGROUP_LIST_ID, Delete_SubGroupList_ID_GenratorFunction)
  yield takeEvery(EDIT_SUBGROUPMASTER_ID, Edit_SubGrouplist_ID_GenratorFunction)
  yield takeEvery(UPDATE_SUBGROUPMASTER_ID, Update_SubGrouplist_ID_GenratorFunction)
}

export default SubGroupSaga;