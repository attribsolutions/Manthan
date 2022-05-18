import { call, put, takeEvery } from "redux-saga/effects";
import {getEmployeeAPI,getRolesAPI,postAddUser,UserGetApi,deteletRoleID,editRoleID,putUpdateRole}
from "../../../helpers/backend_helper";
import {GET_EMPLOYEE,GET_ROLE,ADD_USER,GET_USER,
  DELETE_USER,EDIT_USER,UPDATE_USER}from './actionType'
import{getEmployeeSuccess,getRolesSuccess,addUserSuccess,
  getUserSuccess,deleteSuccess,editSuccess,updateSuccess}from "./actions";
import { UserListAPI } from "./UserListAPI";

/// employee dropdown list
function* Employeelist() {
  
  try {
  
    const response = yield call(getEmployeeAPI);
    yield put(getEmployeeSuccess(response.Data));
    //  console.log('inside a function employee',response)
  } catch (error) {
    console.log("Employeelist  saga page error", error);
  }
}

/// roles dropdownlist
function* Rolelist() {
  
  try {
  
    const response = yield call(getRolesAPI);
    yield put(getRolesSuccess(response.Data));
    //  console.log('data',response.Data)
  } catch (error) {
    console.log("Rolelist  saga page error", error);
  }
}

//// post api
function* AddUser({ Data }) {
  try {
   
    yield console.log("AddUser saga : saga befor axios pass data", Data); //comment line only

    const response = yield call(postAddUser, Data);
    yield put(addUserSuccess(response));
    yield console.log(" AddUser saga : after axios Addapi response ", response); //comment line only
  } catch (error) {
    yield console.log("postUser saga error :", error);
  }
}

//// list api
function* sagaUserGetApi() {
  try {
  const response= yield call(UserGetApi);
      yield put(getUserSuccess(response.Data));
    // console.log("get saga",response)
    } catch (error) {
     console.log("RoleSaga error",error)
    }
}

  //// delete api 
  function* deleteUser({ id }) {
    try {
      const response = yield call(deteletRoleID, id);
      yield put(deleteSuccess(response.Data));    
    } catch (error) {
      yield console.log("delete User Error : ", error);
    }
  }

  ///// edit api
  
function* editUser({ id }) {
  try {
    if (!id <= 0) {
      const response = yield call(editRoleID, id);
      yield put(editSuccess(UserListAPI));
      console.log(" userlist api response",UserListAPI)
    } else {
      yield put(editSuccess({ Status: 'false' }));
    }

  } catch (error) {
    yield console.log("edit_ID  saga page error  :", error);
  }
}

function* updateUser({ data, id }) {
  try {
    if (data) {
      const response = yield call(putUpdateRole, data, id);
      yield put(updateSuccess(response));
    } else {
      yield put(updateSuccess({ Status: "false" }))
    }
  } catch (error) {
    yield console.log("update saga page error   :", error);
  }
}


function* UserRegistrationSaga() {
  yield takeEvery(GET_EMPLOYEE, Employeelist);
  yield takeEvery(GET_ROLE, Rolelist);
  yield takeEvery(ADD_USER,AddUser);
  yield takeEvery(GET_USER,sagaUserGetApi)
  yield takeEvery(DELETE_USER,deleteUser)
  yield takeEvery(EDIT_USER,editUser)
  yield takeEvery(UPDATE_USER,updateUser)
  
}
export default UserRegistrationSaga;