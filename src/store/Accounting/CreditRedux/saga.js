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
  DELETE_CREDIT_LIST_ID,
  EDIT_GROUPMASTER_ID,
  GET_CREDIT_LIST,
  SAVE_CREDIT,
  UPDATE_GROUPMASTER_ID
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* Save_Method_ForCredit_GenFun({ config }) {              // Save API
  try {
    const response = yield call(save_Group_API, config);
    yield put(saveGroupMaster_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* Get_Credit_List_GenFunc() {                                // getList API
  try {
    const response = yield call(get_Group_List_Api);
    yield put(getGroupListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Delete_Credit_ID_GenFunc({ config }) {                   // delete API
  try {
    const response = yield call(del_Group_List_API, config);
    yield put(deleteGrouplistSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_Grouplist_ID_GenFunc({ config }) {                     // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_Group_List_Api, config);
    response.pageMode = btnmode;
    yield put(editGroupIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Update_Grouplist_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(update_Group_List_Api, config);
    yield put(updateGroupIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* GroupSaga() {
  yield takeEvery(SAVE_CREDIT, Save_Method_ForCredit_GenFun)
  yield takeEvery(GET_CREDIT_LIST, Get_Credit_List_GenFunc)
  yield takeEvery(DELETE_CREDIT_LIST_ID, Delete_Credit_ID_GenFunc)
  yield takeEvery(EDIT_GROUPMASTER_ID, Edit_Grouplist_ID_GenFunc)
  yield takeEvery(UPDATE_GROUPMASTER_ID, Update_Grouplist_ID_GenFunc)
}

export default GroupSaga;