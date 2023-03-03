import { call, put, takeEvery } from "redux-saga/effects";
import { delete_CompanyID, edit_CompanyID, fetch_CompanyList, getCompanyGroup, postSubmit_Company, updateCompany_ID } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
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

  try {
    const response = yield call(fetch_CompanyList);
    yield put(fetchCompanyListSuccess(response.Data));
   
  } catch (error) {
   
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* SubmitCompanyModules({ data }) {

  try {
    const response = yield call(postSubmit_Company, data);
   
    yield put(PostCompanySubmitSuccess(response));
    console.log("response",response)
  } catch (error) {
   
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* deleteCompany_ID({ id }) {
  try {
  
    const response = yield call(delete_CompanyID, id);
   
    yield put(deleteCompanyIDSuccess(response))
    console.log("delete response",response)
  } catch (error) {
   
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* editCompany_ID({ id,pageMode }) {
  try {
    const response = yield call(edit_CompanyID, id);
    response.pageMode=pageMode
    yield put(editCompanyIDSuccess(response));
  } catch (error) {
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* update_Company({ updateData, ID }) {
  
  try {
  
    const response = yield call(updateCompany_ID, updateData, ID);
   
    yield put(updateCompanyIDSuccess(response))
    console.log("saga response",response)
  }
  
  catch (error) {
   
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
