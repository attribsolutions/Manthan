import { call, put, takeEvery } from "redux-saga/effects";
import { detelet_EmployeeType_List_Api, edit_EmployeeType_List_Api, Employee_Type_API, get_EmployeeType_List_Api, update_EmployeeType_List_Api } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteEmployeeTypeIDSuccess, editEmployeeTypeSuccess, getEmployeeTypelistSuccess, PostEmployeeTypeSubmitSuccess, updateEmployeeTypeIDSuccess } from "./action";
import { DELETE_EMPLOYEE_TYPE_ID, EDIT_EMPLOYEE_TYPE_ID, GET_EMPLOYEE_TYPE_LIST, POST_EMPLOYEETYPE_SUBMIT, UPDATE_EMPLOYEE_TYPE_ID } from "./actionTypes";

// post api
function* Post_EmployeeType_GneratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Employee_Type_API, data);
    yield put(SpinnerState(false))
    yield put(PostEmployeeTypeSubmitSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// get api
function* Get_EmployeeTypeList_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_EmployeeType_List_Api);
    yield put(getEmployeeTypelistSuccess(response.Data));
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
function* Delete_EmployeeTypeList_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_EmployeeType_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteEmployeeTypeIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_EmployeeTypeList_ID_GenratorFunction({ id ,pageMode}) {
  try {
    const response = yield call(edit_EmployeeType_List_Api, id);
    response.pageMode=pageMode
    yield put(editEmployeeTypeSuccess(response));

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_EmployeeTypeList_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_EmployeeType_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateEmployeeTypeIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

  function* EmployeeTypeSaga() {
    yield takeEvery(POST_EMPLOYEETYPE_SUBMIT, Post_EmployeeType_GneratorFunction)
    yield takeEvery(GET_EMPLOYEE_TYPE_LIST, Get_EmployeeTypeList_GenratorFunction)
    yield takeEvery(DELETE_EMPLOYEE_TYPE_ID, Delete_EmployeeTypeList_ID_GenratorFunction)
    yield takeEvery(EDIT_EMPLOYEE_TYPE_ID, Edit_EmployeeTypeList_ID_GenratorFunction)
    yield takeEvery(UPDATE_EMPLOYEE_TYPE_ID, Update_EmployeeTypeList_ID_GenratorFunction)

  }
  
  export default EmployeeTypeSaga;