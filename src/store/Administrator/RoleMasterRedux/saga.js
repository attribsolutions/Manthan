import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";
import {
  Role_Master_Delete_API,
  Role_Master_Edit_API,
  Role_Master_Get_API,
  Role_Master_Post_API,
  Role_Master_Update_API
} from "../../../helpers/backend_helper";
import {
  getRoleSuccess,
  PostSuccess, userEditActionSuccess,
  userUpdateActionSuccess,
  userDeleteActionSuccess,
  RoleApiErrorAction
} from "./action";
import {
  GET_ROLE_LIST_API,
  POST_ROLE_MASTER,
  EDIT_ROLE_LIST_ID,
  DELETE_ROLE_LIST_ID,
  UPDATE_ROLE_LIST_ID
} from "./actionTypes";

function* Get_Roles_GenratorFunction() {                                    //Get Role List
  try {
    const response = yield call(Role_Master_Get_API, loginJsonBody());
    yield put(getRoleSuccess(response.Data));
  } catch (error) { yield put(RoleApiErrorAction()) }
}

function* Submit_Roles_GenratorFunction({ config }) {                       //Save Role Master
  try {
    const response = yield call(Role_Master_Post_API, config);
    yield put(PostSuccess(response));
  } catch (error) { yield put(RoleApiErrorAction()) }
}

function* Delete_Roles_GenratorFunction({ config }) {                       //Delete Role Master
  try {
    const response = yield call(Role_Master_Delete_API, config);
    yield put(userDeleteActionSuccess(response))
  } catch (error) { yield put(RoleApiErrorAction()) }
}

function* Edit_Roles_GenratorFunction({ config }) {                         //Edit Role Master
  const { btnmode } = config;
  try {
    const response = yield call(Role_Master_Edit_API, config);
    response.pageMode = btnmode;
    yield put(userEditActionSuccess(response));
  } catch (error) { yield put(RoleApiErrorAction()) }
}


function* Update_Roles_GenratorFunction({ config }) {                       //Update Role Master
  try {
    const response = yield call(Role_Master_Update_API, config);
    yield put(userUpdateActionSuccess(response))
  } catch (error) { yield put(RoleApiErrorAction()) }
}

function* RoleMaster_Saga() {
  yield takeEvery(GET_ROLE_LIST_API, Get_Roles_GenratorFunction);
  yield takeEvery(POST_ROLE_MASTER, Submit_Roles_GenratorFunction);
  yield takeEvery(EDIT_ROLE_LIST_ID, Edit_Roles_GenratorFunction);
  yield takeEvery(DELETE_ROLE_LIST_ID, Delete_Roles_GenratorFunction);
  yield takeEvery(UPDATE_ROLE_LIST_ID, Update_Roles_GenratorFunction);
}

export default RoleMaster_Saga;
