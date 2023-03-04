import { call, put, takeEvery } from "redux-saga/effects";
import { detelet_EmployeeID, edit_EmployeeAPI, getComapny_For_Dropdown, getDesignationID_For_Dropdown, getEmployeeType_For_Dropdown, getRegion_For_Dropdown, getState_For_Dropdown, Get_CompanyBy_EmployeeType_For_Dropdown, get_EmployeelistApi, post_EmployeeData, update_EmployeeAPI } from "../../../helpers/backend_helper";
import {
  GET_DESIGNATIONID, GET_EMPLOYEETYPE,
  GET_STATE, POST_EMPLOYEE, GET_EMPLOYEE_LIST, UPDATE_EMPLOYEE_ID,
  DELETE_EMPLOYEE_ID, EDIT_EMPLOYEE_ID, GET_EMPLOYEE_TYPES_ID, GET_COMPANYNAME_BY_EMPLOYEETYPES_ID, GET_PARTYNAME_BY_DIVISIONTYPES_ID,
} from './actionTypes'
import {
  getDesignationIDSuccess, getEmployeeTypeESuccess,
  getStateESuccess, PostEmployeeSuccess,
  getEmployeelistSuccess,
  deleteEmployeeIDSuccess, editEmployeeSuccess, updateEmployeeIDSuccess, get_EmployeeTypesID_Success, Get_CompanyName_By_EmployeeTypeID_Success, Get_PartyName_By_EmployeeTypeID_Success,
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
function* Submit_Employee_GenratorFunction({ Data }) {
  try {
    const response = yield call(post_EmployeeData, Data);
    console.log("post response in saga file", response)
    yield put(PostEmployeeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

/// get api

function* Get_EmployeeList_GenratorFunction() {
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
function* Delete_EmployeeID_GenratorFunction({ id }) {
  try {
    const response = yield call(detelet_EmployeeID, id);
    yield put(deleteEmployeeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_EmployeeID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_EmployeeAPI, id);
    response.pageMode = pageMode
    yield put(editEmployeeSuccess(response));
    console.log("response in saga", response)

  } catch (error) { CommonConsole(error) }
}

function* Update_EmployeeID_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_EmployeeAPI, updateData, ID);
    yield put(updateEmployeeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// Company Name API dependent on Employee Types api
function* Get_CompanyName_By_EmployeeTypesID_GenratorFunction({ id }) {
  try {
    const response = yield call(Get_CompanyBy_EmployeeType_For_Dropdown, id);
    yield put(Get_CompanyName_By_EmployeeTypeID_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* M_EmployeeSaga() {
  yield takeEvery(GET_DESIGNATIONID, DesignationID_saga);
  yield takeEvery(GET_EMPLOYEETYPE, EmployeeType_saga);
  yield takeEvery(GET_STATE, State_saga);
  yield takeEvery(GET_EMPLOYEE_LIST, Get_EmployeeList_GenratorFunction)
  yield takeEvery(POST_EMPLOYEE, Submit_Employee_GenratorFunction)
  yield takeEvery(EDIT_EMPLOYEE_ID, Edit_EmployeeID_GenratorFunction)
  yield takeEvery(DELETE_EMPLOYEE_ID, Delete_EmployeeID_GenratorFunction)
  yield takeEvery(UPDATE_EMPLOYEE_ID, Update_EmployeeID_GenratorFunction)
  yield takeEvery(GET_COMPANYNAME_BY_EMPLOYEETYPES_ID, Get_CompanyName_By_EmployeeTypesID_GenratorFunction)
}
export default M_EmployeeSaga;