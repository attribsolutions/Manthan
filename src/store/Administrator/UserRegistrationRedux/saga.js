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
  GET_EMPLOYEE, GET_ROLE, ADD_USER, GET_USER,
  DELETE_USER, EDIT_USER, UPDATE_USER, GET_USER_PARTIES_FOR_USER_MASTER, GET_EMPLOYEE_FOR_USER_REGISTRATION
} from './actionType'
import {
  getRolesSuccess,
  addUserSuccess,
  getUserSuccess,
  deleteSuccess,
  editSuccess,
  updateSuccess,
  GetUserPartiesForUserMastePageSuccess,
  getEmployeeForUseRegistrationSuccess
} from "./actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

// employee dropdown list
function* EmployeelistDropdown_GenratorFunction() {
  try {
    const response = yield call(getEmployee_Dropdown_For_UserRegistration_API);
    yield put(getEmployeeForUseRegistrationSuccess(response.Data));
  } catch (error) {
    console.log("Employeelist  saga page error", error);
  }
}

// roles dropdownlist
function* RolesListDropdoun_GenratorFunction() {
  try {
    const response = yield call(RolesListDropdown_For_UserRegistration_API);
    yield put(getRolesSuccess(response.Data));

  } catch (error) {
    console.log("Rolelist  saga page error", error);
  }
}

// post api
function* user_save_GenratorFunction({ data }) {


  yield put(SpinnerState(true))
  try {
    const response = yield call(User_Component_PostMethod_API, data);
    console.log("response",response)
    yield put(SpinnerState(false))
    yield put(addUserSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

//  Get list api
function* Fetch_UserList_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(User_Component_GetMethod_API);
    yield put(getUserSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete api 
function* Delete_UserList_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(User_Component_Delete_Method_API, id);
    yield put(SpinnerState(false))
    yield put(deleteSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_UserList_GenratorFunction({ id }) {
  try {
    const response = yield call(User_Component_EditById_API, id);
    yield put(editSuccess(response));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Update_User_GenratorFunction({ data, id }) {
  debugger
  try {
    yield put(SpinnerState(true))
    const response = yield call(User_Component_Update_API, data, id);
    console.log("update response",response)
    yield put(SpinnerState(false))
    yield put(updateSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Get_UserPartiesForUserMaster_GenratorFunction({ id }) {
  
  try {
    const response = yield call(UserPartiesForUserMaster_API,  id);
    yield put(GetUserPartiesForUserMastePageSuccess(response.Data))
  }
  catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* UserRegistrationSaga() {
  yield takeEvery(GET_EMPLOYEE_FOR_USER_REGISTRATION, EmployeelistDropdown_GenratorFunction);
  yield takeEvery(GET_ROLE, RolesListDropdoun_GenratorFunction);
  yield takeEvery(ADD_USER, user_save_GenratorFunction);
  yield takeEvery(UPDATE_USER, Update_User_GenratorFunction);
  
  yield takeEvery(GET_USER, Fetch_UserList_GenratorFunction)
  yield takeEvery(DELETE_USER, Delete_UserList_GenratorFunction)
  yield takeEvery(EDIT_USER, Edit_UserList_GenratorFunction)
  yield takeEvery(GET_USER_PARTIES_FOR_USER_MASTER, Get_UserPartiesForUserMaster_GenratorFunction)
  
}
export default UserRegistrationSaga;