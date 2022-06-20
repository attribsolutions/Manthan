import { call, put, takeEvery } from "redux-saga/effects";
import { detelet_EmployeeID, edit_EmployeeAPI, getComapny_For_Dropdown, getDesignationID_For_Dropdown, getEmployeeType_For_Dropdown, getRegion_For_Dropdown, getState_For_Dropdown, get_EmployeelistApi, post_EmployeeData, update_EmployeeAPI } from "../../../helpers/backend_helper";
import {
  GET_DESIGNATIONID, GET_EMPLOYEETYPE, GET_REGION,
  GET_STATE, POST_EMPLOYEE, GET_COMPANY, GET_EMPLOYEE_LIST, UPDATE_EMPLOYEE_ID,
  DELETE_EMPLOYEE_ID, EDIT_EMPLOYEE_ID,
} from './actionTypes'
import {
  getDesignationIDSuccess, getEmployeeTypeESuccess,
  getStateESuccess, getRegionSuccess, PostEmployeeSuccess,
  getCompanySuccess, getEmployeelistSuccess,
  deleteEmployeeIDSuccess, editEmployeeSuccess, updateEmployeeIDSuccess, getEmployeelist
} from "./action";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import PageListDropdownData from "../HPagesRedux/PageListData";

///  DesignationID dropdown list
function* DesignationID_saga() {
  try {
    // const response = yield call(getDesignationID_For_Dropdown);
    yield put(getDesignationIDSuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("DesignationID_saga page error", error);
  }
}

//// EmployeeType drop down api
function* EmployeeType_saga() {
  try {
    // const response = yield call(getEmployeeType_For_Dropdown);
    yield put(getEmployeeTypeESuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("EmployeeType_saga  page error", error);
  }
}

///State  dropdown api
function* State_saga() {
  try {
    // const response = yield call(getState_For_Dropdown);
    yield put(getStateESuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("State_saga page error", error);
  }
}

///Region  dropdown api
function* Region_saga() {
  try {
    // const response = yield call(getRegion_For_Dropdown);
    yield put(getRegionSuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("Region_saga page error", error);
  }
}

///Region  dropdown api
function* Company_saga() {
  try {
    // const response = yield call(getComapny_For_Dropdown);
    yield put(getCompanySuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("Employeelist  saga page error", error);
  }
}

///post api

function* Submit_Employee_GenratorFunction({ Data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(post_EmployeeData, Data);
    yield put(SpinnerState(false))
    yield put(PostEmployeeSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

/// get api
  
function* Get_EmployeeList_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    // const response = yield call(get_EmployeelistApi);
    yield put(getEmployeelistSuccess(PageListDropdownData.Data));
    console.log("PageListDropdownData",PageListDropdownData)
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}
//// delete api 

function* Delete_EmployeeID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_EmployeeID, id);
    yield put(SpinnerState(false))
    yield put(deleteEmployeeIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Edit_EmployeeID_GenratorFunction({ id }) {
  try {
    const response = yield call(edit_EmployeeAPI, id);
    yield put(editEmployeeSuccess(response));
  } catch (error) {
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* Update_EmployeeID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_EmployeeAPI, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateEmployeeIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}
function* M_EmployeeSaga() {
  yield takeEvery(GET_DESIGNATIONID, DesignationID_saga);
  yield takeEvery(GET_EMPLOYEETYPE, EmployeeType_saga);
  yield takeEvery(GET_STATE, State_saga);
  yield takeEvery(GET_REGION, Region_saga)
  yield takeEvery(GET_COMPANY, Company_saga)
  yield takeEvery(GET_EMPLOYEE_LIST, Get_EmployeeList_GenratorFunction)
  yield takeEvery(POST_EMPLOYEE, Submit_Employee_GenratorFunction)
  yield takeEvery(EDIT_EMPLOYEE_ID, Edit_EmployeeID_GenratorFunction)
  yield takeEvery(DELETE_EMPLOYEE_ID, Delete_EmployeeID_GenratorFunction)
  yield takeEvery(UPDATE_EMPLOYEE_ID, Update_EmployeeID_GenratorFunction)


}
export default M_EmployeeSaga;