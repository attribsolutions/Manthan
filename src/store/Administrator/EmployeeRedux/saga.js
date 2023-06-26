import { call, put, takeEvery } from "redux-saga/effects";
import {
  detelet_EmployeeID,
  edit_EmployeeAPI,
  getDesignationID_For_Dropdown,
  getState_For_Dropdown, Get_CompanyBy_EmployeeType_For_Dropdown,
  get_EmployeelistApi,
  save_Employee_API,
  update_EmployeeAPI,
  getCity_For_Dropdown
} from "../../../helpers/backend_helper";
import {
  GET_DESIGNATIONID,
  GET_STATE, SAVE_EMPLOYEE_MASTER,
  GET_EMPLOYEE_LIST,
  UPDATE_EMPLOYEE_ID,
  DELETE_EMPLOYEE_ID,
  EDIT_EMPLOYEE_ID,
  GET_COMPANYNAME_BY_EMPLOYEETYPES_ID,
  GET_CITY_ON_DISTRICT,
} from './actionTypes'
import {
  getDesignationIDSuccess,
  getStateESuccess, PostEmployeeSuccess,
  getEmployeelistSuccess,
  deleteEmployeeIDSuccess,
  editEmployeeSuccess,
  updateEmployeeIDSuccess,
  Get_CompanyName_By_EmployeeTypeID_Success,
  getCityOnDistrictSuccess,
  EmployeeApiErrorAction,
} from "./action";
import { loginJsonBody, } from "../../../components/Common/CommonFunction";

function* DesignationID_saga() { // DesignationID dropdown list
  try {
    const response = yield call(getDesignationID_For_Dropdown);
    yield put(getDesignationIDSuccess(response.Data));
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* State_saga() { // State  dropdown api
  try {
    const response = yield call(getState_For_Dropdown);
    yield put(getStateESuccess(response.Data));
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* City_saga(id) { // City  dropdown api
  try {

    const response = yield call(getCity_For_Dropdown, id.id);
    yield put(getCityOnDistrictSuccess(response.Data));
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* Save_Employee_GenFunc({ config }) { // post api
  try {
    const response = yield call(save_Employee_API, config);
    yield put(PostEmployeeSuccess(response));
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* Get_EmployeeList_GenFunc() { // get api  
  try {
    const filters = loginJsonBody();
    const response = yield call(get_EmployeelistApi, filters);
    yield put(getEmployeelistSuccess(response.Data));
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* Delete_EmployeeID_GenFunc({ config }) {//// delete api 
  try {
    const response = yield call(detelet_EmployeeID, config);
    yield put(deleteEmployeeIDSuccess(response))
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* Edit_EmployeeID_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(edit_EmployeeAPI, config);
    response.pageMode = btnmode
    yield put(editEmployeeSuccess(response));

  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* Update_EmployeeID_GenFunc({ config }) {
  try {
    const response = yield call(update_EmployeeAPI, config);
    yield put(updateEmployeeIDSuccess(response))
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

// Company Name API dependent on Employee Types api
function* Get_CompanyName_By_EmployeeTypesID_GenFunc({ id }) {
  try {
    const response = yield call(Get_CompanyBy_EmployeeType_For_Dropdown, id);
    yield put(Get_CompanyName_By_EmployeeTypeID_Success(response.Data));
  } catch (error) { yield put(EmployeeApiErrorAction()) }
}

function* M_EmployeeSaga() {
  yield takeEvery(GET_DESIGNATIONID, DesignationID_saga);
  yield takeEvery(GET_STATE, State_saga);
  yield takeEvery(GET_CITY_ON_DISTRICT, City_saga);
  yield takeEvery(GET_EMPLOYEE_LIST, Get_EmployeeList_GenFunc)
  yield takeEvery(SAVE_EMPLOYEE_MASTER, Save_Employee_GenFunc)
  yield takeEvery(EDIT_EMPLOYEE_ID, Edit_EmployeeID_GenFunc)
  yield takeEvery(DELETE_EMPLOYEE_ID, Delete_EmployeeID_GenFunc)
  yield takeEvery(UPDATE_EMPLOYEE_ID, Update_EmployeeID_GenFunc)
  yield takeEvery(GET_COMPANYNAME_BY_EMPLOYEETYPES_ID, Get_CompanyName_By_EmployeeTypesID_GenFunc)
}
export default M_EmployeeSaga;