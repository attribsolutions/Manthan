import { call, put, takeEvery } from "redux-saga/effects";
import {
  detelet_EmployeeID,
  edit_EmployeeAPI,
  getDesignationID_For_Dropdown,
  getEmployeeType_For_Dropdown,
  getState_For_Dropdown, Get_CompanyBy_EmployeeType_For_Dropdown,
  get_EmployeelistApi,
  save_Employee_API,
  update_EmployeeAPI
} from "../../../helpers/backend_helper";
import {
  GET_DESIGNATIONID, GET_EMPLOYEETYPE,
  GET_STATE, SAVE_EMPLOYEE_MASTER, GET_EMPLOYEE_LIST, UPDATE_EMPLOYEE_ID,
  DELETE_EMPLOYEE_ID, EDIT_EMPLOYEE_ID, GET_COMPANYNAME_BY_EMPLOYEETYPES_ID,
} from './actionTypes'
import {
  getDesignationIDSuccess, getEmployeeTypeESuccess,
  getStateESuccess, PostEmployeeSuccess,
  getEmployeelistSuccess,
  deleteEmployeeIDSuccess, editEmployeeSuccess, updateEmployeeIDSuccess, Get_CompanyName_By_EmployeeTypeID_Success,
} from "./action";
import { CommonConsole, loginCompanyID, loginRoleID, loginUserID } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

///  DesignationID dropdown list
function* DesignationID_saga() {
  try {
    const response = yield call(getDesignationID_For_Dropdown);
    yield put(getDesignationIDSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

//// EmployeeType drop down api
function* EmployeeType_saga() {
  try {
    const response = yield call(getEmployeeType_For_Dropdown);
    yield put(getEmployeeTypeESuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

///State  dropdown api
function* State_saga() {
  try {
    const response = yield call(getState_For_Dropdown);
    yield put(getStateESuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

///post api
function* Submit_Employee_GenFunc({ Data }) {
  try {
    const response = yield call(save_Employee_API, Data);
    console.log("post response in saga file", response)
    yield put(PostEmployeeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

/// get api

function* Get_EmployeeList_GenFunc() {
  try {
    const jsonBody = {
      "UserID": loginUserID(),
      "RoleID": loginRoleID(),
      "CompanyID": loginCompanyID()
    }
    const response = yield call(get_EmployeelistApi, jsonBody);
    yield put(getEmployeelistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

//// delete api 
function* Delete_EmployeeID_GenFunc({ config }) {
  try {
    const response = yield call(detelet_EmployeeID, config);
    yield put(deleteEmployeeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_EmployeeID_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(edit_EmployeeAPI, config);
    response.pageMode = btnmode
    yield put(editEmployeeSuccess(response));
    console.log("response in saga", response)

  } catch (error) { CommonConsole(error) }
}

function* Update_EmployeeID_GenFunc({ config }) {
  try {
    const response = yield call(update_EmployeeAPI, config);
    yield put(updateEmployeeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// Company Name API dependent on Employee Types api
function* Get_CompanyName_By_EmployeeTypesID_GenFunc({ id }) {
  try {
    const response = yield call(Get_CompanyBy_EmployeeType_For_Dropdown, id);
    yield put(Get_CompanyName_By_EmployeeTypeID_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* M_EmployeeSaga() {
  yield takeEvery(GET_DESIGNATIONID, DesignationID_saga);
  yield takeEvery(GET_EMPLOYEETYPE, EmployeeType_saga);
  yield takeEvery(GET_STATE, State_saga);
  yield takeEvery(GET_EMPLOYEE_LIST, Get_EmployeeList_GenFunc)
  yield takeEvery(SAVE_EMPLOYEE_MASTER, Submit_Employee_GenFunc)
  yield takeEvery(EDIT_EMPLOYEE_ID, Edit_EmployeeID_GenFunc)
  yield takeEvery(DELETE_EMPLOYEE_ID, Delete_EmployeeID_GenFunc)
  yield takeEvery(UPDATE_EMPLOYEE_ID, Update_EmployeeID_GenFunc)
  yield takeEvery(GET_COMPANYNAME_BY_EMPLOYEETYPES_ID, Get_CompanyName_By_EmployeeTypesID_GenFunc)
}
export default M_EmployeeSaga;