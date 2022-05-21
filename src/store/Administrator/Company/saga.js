import { call, put, takeEvery } from "redux-saga/effects";
import { delete_CompanyID, edit_CompanyID, fetch_CompanyList, postSubmit_Company, updateCompany_ID } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {  editCompanyIDSuccess, fetchCompanyList, fetchCompanyListSuccess, PostCompanySubmitSuccess, updateCompanyIDSuccess } from "./actions";
import {
  DELETE_COMPANY_ID,
  EDIT_COMPANY_ID,
  FETCH_COMPANY_LIST,
  POST_COMPANY_SUBMIT,
  UPDATE_COMPANY_ID,

} from "./actionType";

function* fetch_CompanyList_data() {
  try {
    yield put(SpinnerState(true));
    const response = yield call(fetch_CompanyList);
    yield put(SpinnerState(false));
    yield put(fetchCompanyListSuccess(response.Data));
  } catch (error) {
    yield put(SpinnerState(false));
    yield console.log("fetchCompanyList  saga page error ***  :", error);
  }
}
function* SubmitCompanyModules({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(postSubmit_Company, data);
    if (response.StatusCode === 200) {
      yield put(SpinnerState(false))
      yield put(PostCompanySubmitSuccess({ Status: true }));
      yield put(AlertState({ Type: 1, Status: true, Message: response.Message, RedirectPath: '/companyList', AfterResponseAction: false }));
    } else {
      yield put(SpinnerState(false))
      // yield put(AlertState({ Type: 4, Status: true, Message: "error Message", RedirectPath: false, AfterResponseAction: false }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
   console.log("$$SubmitCompanyModules  saga page error$", error);
  }
}


function* deleteCompany_ID({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(delete_CompanyID, id);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: fetchCompanyList,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
    console.log("deleteCompany_ID  saga page error ***  :", error);
  }
}
function* editCompany_ID({ id }) {
  try {
    if (!id <= 0) {
      const response = yield call(edit_CompanyID, id);
      yield put(editCompanyIDSuccess(response));
    } else {
      yield put(editCompanyIDSuccess({ status: 'false' }));
    }
  } catch (error) {
    console.log("editCompany_ID  saga page error ***  :", error);
  }
}
function* update_Company({ data, id }) {
  yield put(SpinnerState(false))

  try {
    const response = yield call(updateCompany_ID, data, id);
    yield put(SpinnerState(false))
    
    if (response.StatusCode === 200) {
      yield put(updateCompanyIDSuccess({Status:true}));
      yield put(editCompanyIDSuccess({Status:false}));
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: fetchCompanyList,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  
  } catch (error) {
    yield put(SpinnerState(false))
     console.log("update_Company  saga page error ***  :", error);
  }
}
function* CompanySaga() {
  yield takeEvery(FETCH_COMPANY_LIST, fetch_CompanyList_data);
  yield takeEvery(EDIT_COMPANY_ID, editCompany_ID);
  yield takeEvery(POST_COMPANY_SUBMIT, SubmitCompanyModules);
  yield takeEvery(DELETE_COMPANY_ID, deleteCompany_ID);
  yield takeEvery(UPDATE_COMPANY_ID, update_Company);

}

export default CompanySaga;
