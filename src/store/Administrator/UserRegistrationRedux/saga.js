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
  DELETE_USER, EDIT_USER, UPDATE_USER, GET_USER_PARTIES_FOR_USER_MASTER, GET_EMPLOYEE_FOR_USER_REGISTRATION
} from './actionType'
import {
  addUserSuccess,
  getUserSuccess,
  deleteSuccess,
  editSuccess,
  updateSuccess,
  GetUserPartiesForUserMastePageSuccess,
  getEmployeeForUseRegistrationSuccess
} from "./actions";
import { CommonConsole, loginJsonBody } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

// employee dropdown list
function* EmployeelistDropdown_GenFunc() {
  try {
    const response = yield call(getEmployee_Dropdown_For_UserRegistration_API);
    yield put(getEmployeeForUseRegistrationSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// post api
function* user_save_GenFunc({ config }) {
  try {
    const response = yield call(User_Component_PostMethod_API, config);
    yield put(addUserSuccess(response));
  } catch (error) { CommonConsole(error) }

}

function* userList_GenFunc() { //  Get  Users list  for List page  POST_api
  const filters = JSON.stringify(loginJsonBody())
  try {
    const response = yield call(User_Component_GetMethod_API, filters);
    yield put(getUserSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_UserList_GenFunc({ config }) {
  try {
    const response = yield call(User_Component_Delete_Method_API, config);
    yield put(deleteSuccess(response))
  } catch (error) { CommonConsole(error) }

}

// edit api
function* Edit_UserList_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(User_Component_EditById_API, config);
    response.pageMode = btnmode
    yield put(editSuccess(response));
  } catch (error) { CommonConsole(error) }

}

function* Update_User_GenFunc({ config }) {
  try {
    const response = yield call(User_Component_Update_API, config);
    yield put(updateSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Get_UserPartiesForUserMaster_GenFunc({ config }) {
  // {
  //   "UserRole": [
  //     {
  //       "Party": 4,
  //       "PartyName": "Krupa Traders",
  //       "PartyRoles": [
  //         {
  //           "Role": 3,
  //           "RoleName": "Superstokist Admin"
  //         }
  //       ]
  //     }}
  const { id, editRole = [] } = config
  debugger
  try {
    const response = yield call(UserPartiesForUserMaster_API, id);
    debugger
    const rewRes = response.Data.map(i1 => {
      // debugger
      let newRole = []
      editRole.map(i2 => {
        // debugger
        if (i2.Party == i1.Party_id) {
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
      debugger
      return arr
    })
    debugger
    yield put(GetUserPartiesForUserMastePageSuccess(rewRes))
  } catch (error) { CommonConsole(error) }

}

function* UserRegistrationSaga() {
  yield takeEvery(GET_EMPLOYEE_FOR_USER_REGISTRATION, EmployeelistDropdown_GenFunc);
  yield takeEvery(ADD_USER, user_save_GenFunc);
  yield takeEvery(UPDATE_USER, Update_User_GenFunc);
  yield takeEvery(GET_USER_LIST_FOR_USER, userList_GenFunc)
  yield takeEvery(DELETE_USER, Delete_UserList_GenFunc)
  yield takeEvery(EDIT_USER, Edit_UserList_GenFunc)
  yield takeEvery(GET_USER_PARTIES_FOR_USER_MASTER, Get_UserPartiesForUserMaster_GenFunc)

}
export default UserRegistrationSaga;