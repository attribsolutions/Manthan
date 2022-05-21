import { call, put, takeEvery } from "redux-saga/effects";
import {
  getEmployee_Dropdown_For_UserRegistration_API,
  RolesListDropdown_For_UserRegistration_API,
  User_Component_PostMethod_API,
  User_Component_GetMethod_API,
  User_Component_Delete_Method_API,
  User_Component_EditById_API,
  User_Component_Update_API
} from "../../../helpers/backend_helper";
import {
  GET_EMPLOYEE, GET_ROLE, ADD_USER, GET_USER,
  DELETE_USER, EDIT_USER, UPDATE_USER
} from './actionType'
import {
  getEmployeeSuccess,
  getRolesSuccess,
  addUserSuccess,
  getUserSuccess,
  deleteSuccess,
  editSuccess,
  updateSuccess
} from "./actions";
import { UserListAPI } from "./UserListAPI";

/// employee dropdown list
function* EmployeelistDropdown_GenratorFunction() {
  try {
    const response = yield call(getEmployee_Dropdown_For_UserRegistration_API);
    yield put(getEmployeeSuccess(response.Data));
  } catch (error) {
    console.log("Employeelist  saga page error", error);
  }
}

/// roles dropdownlist
function* RolesListDropdoun_GenratorFunction() {
  try {
    const response = yield call(RolesListDropdown_For_UserRegistration_API);
    yield put(getRolesSuccess(response.Data));
  } catch (error) {
    console.log("Rolelist  saga page error", error);
  }
}

//// post api
function* user_save_GenratorFunction({ Data }) {
  try {
    yield console.log("AddUser saga : saga befor axios pass data", Data);
    const response = yield call(User_Component_PostMethod_API, Data);
    yield put(addUserSuccess(response));
    yield console.log(" AddUser saga : after axios Addapi response ", response); 
  } catch (error) {
    yield console.log("postUser saga error :", error);
  }
}

////  Get list api
function* Fetch_UserList_GenratorFunction() {
  try {
    const response = yield call(User_Component_GetMethod_API);
    yield put(getUserSuccess(response.Data));
  } catch (error) {
    console.log("RoleSaga error", error)
  }
}

//// delete api 
function* Delete_UserList_GenratorFunction({ id }) {
  try {
    const response = yield call(User_Component_Delete_Method_API, id);
    yield put(deleteSuccess(response.Data));
  } catch (error) {
    yield console.log("delete User Error : ", error);
  }
}

// edit api
function* Edit_UserList_GenratorFunction({ id }) {
  try {
    if (!id <= 0) {

      const response = yield call(User_Component_EditById_API, id);
      yield put(editSuccess(response.Data));
      console.log(" userlist api response", response)

    } else {
      yield put(editSuccess({ Status: 'false' }));
    }
  } catch (error) {
    yield console.log("edit_ID  saga page error  :", error);
  }
}
function* Update_User_GenratorFunction({ data, id }) {
  try {
    if (data) {
      const response = yield call(User_Component_Update_API, data, id);
      yield put(updateSuccess(response));
    } else {
      yield put(updateSuccess({ Status: "false" }))
    }
  } catch (error) {
    yield console.log("update saga page error   :", error);
  }
}

function* UserRegistrationSaga() {
  yield takeEvery(GET_EMPLOYEE, EmployeelistDropdown_GenratorFunction);
  yield takeEvery(GET_ROLE, RolesListDropdoun_GenratorFunction);
  yield takeEvery(ADD_USER, user_save_GenratorFunction);
  yield takeEvery(GET_USER, Fetch_UserList_GenratorFunction)
  yield takeEvery(DELETE_USER, Delete_UserList_GenratorFunction)
  yield takeEvery(EDIT_USER, Edit_UserList_GenratorFunction)
  yield takeEvery(UPDATE_USER, Update_User_GenratorFunction)

}
export default UserRegistrationSaga;