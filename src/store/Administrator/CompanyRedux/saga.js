import { call, put, takeEvery } from "redux-saga/effects";
import { delete_CompanyID, edit_CompanyID, fetch_CompanyList, getCompanyGroup, postSubmit_Company, updateCompany_ID } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {  deleteCompanyIDSuccess, editCompanyIDSuccess,  fetchCompanyListSuccess, getCompanyGroupSuccess, PostCompanySubmitSuccess, updateCompanyIDSuccess } from "./actions";
import {
  DELETE_COMPANY_ID,
  EDIT_COMPANY_ID,
  FETCH_COMPANY_LIST,
  GET_COMPANYGROUP,
  POST_COMPANY_SUBMIT,
  UPDATE_COMPANY_ID,

} from "./actionType";

function* fetch_CompanyList_data() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(fetch_CompanyList);
    yield put(fetchCompanyListSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* SubmitCompanyModules({ Data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(postSubmit_Company, Data);
    yield put(SpinnerState(false))
    yield put(PostCompanySubmitSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* deleteCompany_ID({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(delete_CompanyID, id);
    yield put(SpinnerState(false))
    yield put(deleteCompanyIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* editCompany_ID({ id }) {
  try {
    const response = yield call(edit_CompanyID, id);
    yield put(editCompanyIDSuccess(response));
  } catch (error) {
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* update_Company({ updateMessage, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(updateCompany_ID, updateMessage, ID);
    yield put(SpinnerState(false))
    yield put(updateCompanyIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

/// CompanyGroupDropdown
function* CompanyGroup() {
  try {
  
    const response = yield call(getCompanyGroup);
    yield put(getCompanyGroupSuccess(response.Data));
  } catch (error) {
    console.log("CompanyGroup saga page error", error);
  }
}

function* CompanySaga() {
  yield takeEvery(FETCH_COMPANY_LIST, fetch_CompanyList_data);
  yield takeEvery(EDIT_COMPANY_ID, editCompany_ID);
  yield takeEvery(POST_COMPANY_SUBMIT, SubmitCompanyModules);
  yield takeEvery(DELETE_COMPANY_ID, deleteCompany_ID);
  yield takeEvery(UPDATE_COMPANY_ID, update_Company);
  yield takeEvery(GET_COMPANYGROUP, CompanyGroup);

}

export default CompanySaga;
