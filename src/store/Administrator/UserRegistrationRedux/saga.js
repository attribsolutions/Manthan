import { call, put, takeEvery } from "redux-saga/effects";
import {
  getEmployee_Dropdown_For_UserRegistration_API,
  User_Component_PostMethod_API,
  User_Component_GetMethod_API,
  User_Component_Delete_Method_API,
  User_Component_EditById_API,
  User_Component_Update_API,
  UserPartiesForUserMaster_API
} from "../../../helpers/backend_helper";
import {
  ADD_USER, GET_USER_LIST_FOR_USER,
  DELETE_USER_ACTION,
  EDIT_USER_ACTION,
  UPDATE_USER_ACTION,
  GET_USER_PARTIES_FOR_USER_MASTER,
  GET_EMPLOYEE_FOR_USER_REGISTRATION
} from './actionType'
import {
  saveUserMasterActionSuccess,
  getUserListSuccess,
  userDeleteActionSuccess,
  userEditActionSuccess,
  userUpdateActionSuccess,
  GetUserPartiesForUserMastePageSuccess,
  getEmployeeForUseRegistrationSuccess,
  UserApiErrorAction
} from "./actions";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";

// employee dropdown list
function* EmployeelistDropdown_GenFunc() {
  try {
    const response = yield call(getEmployee_Dropdown_For_UserRegistration_API);
    yield put(getEmployeeForUseRegistrationSuccess(response.Data));
  } catch (error) { yield put(UserApiErrorAction()) }
}

// post api
function* user_save_GenFunc({ config }) {
  try {
    const response = yield call(User_Component_PostMethod_API, config);
    yield put(saveUserMasterActionSuccess(response));
  } catch (error) { yield put(UserApiErrorAction()) }

}

function* userList_GenFunc() { //  Get  Users list  for List page  POST_api
  const filters = JSON.stringify(loginJsonBody())
  try {
    const response = yield call(User_Component_GetMethod_API, filters);
    yield put(getUserListSuccess(response.Data));
  } catch (error) { yield put(UserApiErrorAction()) }
}

// delete api 
function* Delete_UserList_GenFunc({ config }) {
  try {
    const response = yield call(User_Component_Delete_Method_API, config);
    yield put(userDeleteActionSuccess(response))
  } catch (error) { yield put(UserApiErrorAction()) }

}

// edit api
function* Edit_UserList_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(User_Component_EditById_API, config);
    response.pageMode = btnmode
    yield put(userEditActionSuccess(response));
  } catch (error) { yield put(UserApiErrorAction()) }

}

function* Update_User_GenFunc({ config }) {
  try {
    const response = yield call(User_Component_Update_API, config);
    yield put(userUpdateActionSuccess(response))
  } catch (error) { yield put(UserApiErrorAction()) }
}

function* Get_UserPartiesForUserMaster_GenFunc({ editDetail }) {

  const { id, editRole = [] } = editDetail
  try {
    const response = yield call(UserPartiesForUserMaster_API, id);
    const rewRes = response.Data.map(i1 => {
      let newRole = []
      editRole.map(i2 => {
        if (i2.Party === i1.Party_id) {
          newRole = i2.PartyRoles.map(i3 => ({
            value: i3.Role,
            label: i3.RoleName
          }));
        }
      })
      const arr = {
        PartyRoles: newRole,
        Party: i1.Party_id,
        PartyName: i1.PartyName
      }
      return arr
    })
    yield put(GetUserPartiesForUserMastePageSuccess(rewRes))

  } catch (error) { yield put(UserApiErrorAction()) }

}

function* UserRegistrationSaga() {
  yield takeEvery(GET_EMPLOYEE_FOR_USER_REGISTRATION, EmployeelistDropdown_GenFunc);
  yield takeEvery(ADD_USER, user_save_GenFunc);
  yield takeEvery(UPDATE_USER_ACTION, Update_User_GenFunc);
  yield takeEvery(GET_USER_LIST_FOR_USER, userList_GenFunc)
  yield takeEvery(DELETE_USER_ACTION, Delete_UserList_GenFunc)
  yield takeEvery(EDIT_USER_ACTION, Edit_UserList_GenFunc)
  yield takeEvery(GET_USER_PARTIES_FOR_USER_MASTER, Get_UserPartiesForUserMaster_GenFunc)

}
export default UserRegistrationSaga;