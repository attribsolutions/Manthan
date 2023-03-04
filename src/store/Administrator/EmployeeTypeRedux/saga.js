import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { detelet_EmployeeType_List_Api, edit_EmployeeType_List_Api, Employee_Type_API, get_EmployeeType_List_Api, update_EmployeeType_List_Api } from "../../../helpers/backend_helper";
import { deleteEmployeeTypeIDSuccess, editEmployeeTypeSuccess, getEmployeeTypelistSuccess, PostEmployeeTypeSubmitSuccess, updateEmployeeTypeIDSuccess } from "./action";
import { DELETE_EMPLOYEE_TYPE_ID, EDIT_EMPLOYEE_TYPE_ID, GET_EMPLOYEE_TYPE_LIST, POST_EMPLOYEETYPE_SUBMIT, UPDATE_EMPLOYEE_TYPE_ID } from "./actionTypes";

// post api
function* Post_EmployeeType_GneratorFunction({ data }) {
  try {
    const response = yield call(Employee_Type_API, data);
    yield put(PostEmployeeTypeSubmitSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get api
function* Get_EmployeeTypeList_GenratorFunction() {
  try {
    const response = yield call(get_EmployeeType_List_Api);
    yield put(getEmployeeTypelistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_EmployeeTypeList_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(detelet_EmployeeType_List_Api, id);
    yield put(deleteEmployeeTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_EmployeeTypeList_ID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_EmployeeType_List_Api, id);
    response.pageMode = pageMode
    yield put(editEmployeeTypeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_EmployeeTypeList_ID_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_EmployeeType_List_Api, updateData, ID);
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