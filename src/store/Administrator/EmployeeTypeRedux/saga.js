import { call, put, takeEvery } from "redux-saga/effects";
import { Employee_Type_API } from "../../../helpers/backend_helper";
import { PostEmployeeTypeSubmitSuccess } from "./action";
import { POST_EMPLOYEETYPE_SUBMIT } from "./actionTypes";

function* EmployeeType_GneratorFunction({ data }) {
  try {
    const response = yield call(Employee_Type_API, data);
    yield put(PostEmployeeTypeSubmitSuccess(response));
    console.log("response",response)
  } catch (error) {
  }
}

  function* EmployeeTypeSaga() {
    yield takeEvery(POST_EMPLOYEETYPE_SUBMIT, EmployeeType_GneratorFunction)
  }
  
  export default EmployeeTypeSaga;