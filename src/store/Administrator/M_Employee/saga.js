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
  deleteEmployeeIDSuccess, editEmployeeSuccess, updateEmployeeIDSuccess
} from "./action";

///  DesignationID dropdown list
function* DesignationID_saga() {
  try {
    const response = yield call(getDesignationID_For_Dropdown);
    yield put(getDesignationIDSuccess(response.Data));
  } catch (error) {
    console.log("DesignationID_saga page error", error);
  }
}

//// EmployeeType drop down api
function* EmployeeType_saga() {
  try {
    const response = yield call(getEmployeeType_For_Dropdown);
    yield put(getEmployeeTypeESuccess(response.Data));
  } catch (error) {
    console.log("EmployeeType_saga  page error", error);
  }
}

///State  dropdown api
function* State_saga() {
  try {
    const response = yield call(getState_For_Dropdown);
    yield put(getStateESuccess(response.Data));
  } catch (error) {
    console.log("State_saga page error", error);
  }
}

///Region  dropdown api
function* Region_saga() {
  try {
    const response = yield call(getRegion_For_Dropdown);
    yield put(getRegionSuccess(response.Data));
  } catch (error) {
    console.log("Region_saga page error", error);
  }
}

///Region  dropdown api
function* Company_saga() {
  try {
    const response = yield call(getComapny_For_Dropdown);
    yield put(getCompanySuccess(response.Data));
  } catch (error) {
    console.log("Employeelist  saga page error", error);
  }
}

///post api
function* Employee_saga({ Data }) {
  try {
    const response = yield call(post_EmployeeData, Data);
    yield put(PostEmployeeSuccess(response));
    console.log("response", response)
  } catch (error) {
    yield console.log("postCompany saga error :", error);
  }
}

/// get api
function* Employeelistsaga() {
  try {
    const response = yield call(get_EmployeelistApi);
    yield put(getEmployeelistSuccess(response.Data));
    console.log("get saga", response)
  } catch (error) {
    console.log("Employee list saga saga error", error)
  }
}

//// delete api 
function* DeleteEmployeeID({ id }) {
  try {
    const response = yield call(detelet_EmployeeID, id);
    yield put(deleteEmployeeIDSuccess(response.Data));
  } catch (error) {
    yield console.log("delete Role Error : ", error);
  }
}

function* editEmployeeID({ id }) {
  try {
    if (!id <= 0) {
      const response = yield call(edit_EmployeeAPI, id);
      yield put(editEmployeeSuccess(response));
      console.log("response in saga page", response)
    } else {
      yield put(editEmployeeSuccess({ Status: 'false' }));
    }

  } catch (error) {
    yield console.log("edit_ID  saga page error  :", error);
  }
}

function* updateEmployeeID({ data, id }) {
  try {
    if (data) {
      const response = yield call(update_EmployeeAPI, data, id);
      yield put(updateEmployeeIDSuccess(response));
      console.log("updateCompanyID  saga page rrr", response)
    } else {
      yield put(updateEmployeeIDSuccess({ Status: 'false' }))
    }
    // debugger;
  } catch (error) {
    yield console.log("updateEmployeeID saga page error   :", error);
  }
}


function* M_EmployeeSaga() {
  yield takeEvery(GET_DESIGNATIONID, DesignationID_saga);
  yield takeEvery(GET_EMPLOYEETYPE, EmployeeType_saga);
  yield takeEvery(GET_STATE, State_saga);
  yield takeEvery(GET_REGION, Region_saga)
  yield takeEvery(POST_EMPLOYEE, Employee_saga)
  yield takeEvery(GET_COMPANY, Company_saga)
  yield takeEvery(GET_EMPLOYEE_LIST, Employeelistsaga)

  yield takeEvery(EDIT_EMPLOYEE_ID, editEmployeeID)
  yield takeEvery(DELETE_EMPLOYEE_ID, DeleteEmployeeID)
  yield takeEvery(UPDATE_EMPLOYEE_ID, updateEmployeeID)


}
export default M_EmployeeSaga;