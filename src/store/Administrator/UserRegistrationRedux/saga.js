import { call, put, takeEvery } from "redux-saga/effects";
import {
  getEmployee_Dropdown_For_UserRegistration_API,
  RolesListDropdown_For_UserRegistration_API,
  User_Component_PostMethod_API,
  User_Component_GetMethod_API,
  User_Component_Delete_Method_API,
  User_Component_EditById_API,
  User_Component_Update_API,
  UserPartiesForUserMaster_API
} from "../../../helpers/backend_helper";
import {
  GET_EMPLOYEE, GET_ROLE, ADD_USER, GET_USER_LIST_FOR_USER,
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
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

// employee dropdown list
function* EmployeelistDropdown_GenFunc() {
  try {
    const response = yield call(getEmployee_Dropdown_For_UserRegistration_API);
    yield put(getEmployeeForUseRegistrationSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// post api
function* user_save_GenFunc({ data }) {
  try {
    const response = yield call(User_Component_PostMethod_API, data);
    yield put(addUserSuccess(response));
  } catch (error) { CommonConsole(error) }

}

function* userList_GenFunc({ jsonbody }) { //  Get  Users list  for List page  POST_api
  try {
    const response = yield call(User_Component_GetMethod_API, jsonbody);
    yield put(getUserSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_UserList_GenFunc({ id }) {
  try {
    const response = yield call(User_Component_Delete_Method_API, id);
    yield put(deleteSuccess(response))
  } catch (error) { CommonConsole(error) }

}

// edit api
function* Edit_UserList_GenFunc({ id, pageMode }) {
  try {
    const response = yield call(User_Component_EditById_API, id);
    response.pageMode = pageMode
    yield put(editSuccess(response));
  } catch (error) { CommonConsole(error) }

}

function* Update_User_GenFunc({ data, id }) {
  try {
    const response = yield call(User_Component_Update_API, data, id);
    yield put(updateSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Get_UserPartiesForUserMaster_GenFunc({ id }) {
  try {
    const response = yield call(UserPartiesForUserMaster_API, id);
    yield put(GetUserPartiesForUserMastePageSuccess(response.Data))
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