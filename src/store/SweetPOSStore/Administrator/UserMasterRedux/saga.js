import { call, put, takeLatest } from "redux-saga/effects";
import {
 
  GET_POS_ROLE,
  ADD_POS_USER,
  UPDATE_POS_USER_ACTION,
  GET_POS_USER_LIST,
  DELETE_POS_USER_ACTION,
  EDIT_POS_USER_ACTION
} from './actionType'
import {
  POSUserApiErrorAction,
  savePOSUserMasterActionSuccess,
  getPOSUserListSuccess,
  POSuserDeleteActionSuccess,
  POSuserEditActionSuccess,
  POSuserUpdateActionSuccess,
  getPOSRoleSuccess
} from "./actions";
import {  loginJsonBody } from "../../../../components/Common/CommonFunction";
import { POS_USER_Get_Roles, POS_USER_Master_Delete_API, POS_USER_Master_Edit_API, POS_USER_Master_Get_API, POS_USER_Master_Post_API, POS_USER_Master_Update_API } from "../../../../helpers/backend_helper";

// employee dropdown list
function* POSRoleDropdown_GenFunc() {
  try {
    const response = yield call(POS_USER_Get_Roles);
    yield put(getPOSRoleSuccess(response.Data));
  } catch (error) { yield put(POSUserApiErrorAction()) }
}

// post api
function* POS_user_save_GenFunc({ config }) {
  try {
    const response = yield call(POS_USER_Master_Post_API, config);
    yield put(savePOSUserMasterActionSuccess(response));
  } catch (error) { yield put(POSUserApiErrorAction()) }
}

function* POS_userList_GenFunc() { //  Get  Users list  for List page  POST_api
  const filters = JSON.stringify(loginJsonBody())
  try {
    const response = yield call(POS_USER_Master_Get_API, filters);
    yield put(getPOSUserListSuccess(response.Data));
  } catch (error) { yield put(POSUserApiErrorAction()) }
}

// delete api 
function* Delete_POS_UserList_GenFunc({ config }) {
  try {
    const response = yield call(POS_USER_Master_Delete_API, config);
    yield put(POSuserDeleteActionSuccess(response))
  } catch (error) { yield put(POSUserApiErrorAction()) }

}
// edit api
function* Edit_POS_UserList_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(POS_USER_Master_Edit_API, config);
    response.pageMode = btnmode
    yield put(POSuserEditActionSuccess(response));
  } catch (error) { yield put(POSUserApiErrorAction()) }
}

function* Update_POS_User_GenFunc({ config }) {
  try {
    const response = yield call(POS_USER_Master_Update_API, config);
    yield put(POSuserUpdateActionSuccess(response))
  } catch (error) { yield put(POSUserApiErrorAction()) }
}



function* POSUserRegistrationSaga() {
  yield takeLatest(GET_POS_ROLE, POSRoleDropdown_GenFunc);
  yield takeLatest(ADD_POS_USER, POS_user_save_GenFunc);
  yield takeLatest(UPDATE_POS_USER_ACTION, Update_POS_User_GenFunc);
  yield takeLatest(GET_POS_USER_LIST, POS_userList_GenFunc)
  yield takeLatest(DELETE_POS_USER_ACTION, Delete_POS_UserList_GenFunc)
  yield takeLatest(EDIT_POS_USER_ACTION, Edit_POS_UserList_GenFunc)
 

}
export default POSUserRegistrationSaga;