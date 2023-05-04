import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";
import { detelet_EmployeeType_List_Api, edit_EmployeeType_List_Api, Employee_Type_API, get_EmployeeType_List_Api, update_EmployeeType_List_Api } from "../../../helpers/backend_helper";
import { deleteEmployeeTypeIDSuccess, editEmployeeTypeSuccess, getEmployeeTypelistSuccess, PostEmployeeTypeSubmitSuccess, updateEmployeeTypeIDSuccess } from "./action";
import { DELETE_EMPLOYEE_TYPE_ID, EDIT_EMPLOYEE_TYPE_ID, GET_EMPLOYEE_TYPE_LIST, POST_EMPLOYEETYPE_SUBMIT, UPDATE_EMPLOYEE_TYPE_ID } from "./actionTypes";

function* Post_EmployeeType_GneratorFunction({ config }) {           // post api

  try {
    const response = yield call(Employee_Type_API, config);
    // response.Data = { id: 1, Name: "label" }
    yield put(PostEmployeeTypeSubmitSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Get_EmployeeTypeList_GenratorFunction() {
  const filters = loginJsonBody()   // only required CompanyID                 // get api
  try {
    const response = yield call(get_EmployeeType_List_Api, filters);
    yield put(getEmployeeTypelistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Delete_EmployeeTypeList_ID_GenratorFunction({ config }) {         // delete api 
  try {
    const response = yield call(detelet_EmployeeType_List_Api, config);
    yield put(deleteEmployeeTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* Edit_EmployeeTypeList_ID_GenratorFunction({ config }) {         // edit api
  const { btnmode } = config;
  try {
    const response = yield call(edit_EmployeeType_List_Api, config);
    response.pageMode = btnmode
    yield put(editEmployeeTypeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Update_EmployeeTypeList_ID_GenratorFunction({ config }) {        // update api
  try {
    const response = yield call(update_EmployeeType_List_Api, config);
    yield put(updateEmployeeTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* EmployeeTypeSaga() {
  yield takeEvery(POST_EMPLOYEETYPE_SUBMIT, Post_EmployeeType_GneratorFunction)
  yield takeEvery(GET_EMPLOYEE_TYPE_LIST, Get_EmployeeTypeList_GenratorFunction)
  yield takeEvery(DELETE_EMPLOYEE_TYPE_ID, Delete_EmployeeTypeList_ID_GenratorFunction)
  yield takeEvery(EDIT_EMPLOYEE_TYPE_ID, Edit_EmployeeTypeList_ID_GenratorFunction)
  yield takeEvery(UPDATE_EMPLOYEE_TYPE_ID, Update_EmployeeTypeList_ID_GenratorFunction)

}

export default EmployeeTypeSaga;