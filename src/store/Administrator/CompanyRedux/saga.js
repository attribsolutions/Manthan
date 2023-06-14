import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";
import { delete_CompanyID, edit_CompanyID, fetch_CompanyList, getCompanyGroup, postSubmit_Company, updateCompany_ID } from "../../../helpers/backend_helper";
import {
  deleteCompanyIDSuccess,
  editCompanyIDSuccess,
  getCompanyListSuccess,
  getCompanyGroupSuccess,
  saveCompany_Success,
  updateCompanyIDSuccess,
  companyApiErrorAction
} from "./actions";
import {
  DELETE_COMPANY_ID,
  EDIT_COMPANY_ID,
  FETCH_COMPANY_LIST,
  GET_COMPANYGROUP,
  POST_COMPANY_SUBMIT,
  UPDATE_COMPANY_ID,
} from "./actionType";


function* Save_Method_ForCompany_GenFun({ config }) {         // Save API
  try {
    const response = yield call(postSubmit_Company, config);
    yield put(saveCompany_Success(response));
  } catch (error) { yield put(companyApiErrorAction()) }
}

function* Get_Company_List_GenFunc() {                          // getList API
  try {
    const response = yield call(fetch_CompanyList, loginJsonBody());
    yield put(getCompanyListSuccess(response.Data));
  } catch (error) { yield put(companyApiErrorAction()) }
}

function* deleteCompany_ID({ config }) {                      // delete API
  try {
    const response = yield call(delete_CompanyID, config);
    yield put(deleteCompanyIDSuccess(response))
  } catch (error) { yield put(companyApiErrorAction()) }
}

function* editCompany_ID({ config }) {               //Edit API
  const { btnmode } = config;
  try {
    const response = yield call(edit_CompanyID, config);
    response.pageMode = btnmode
    yield put(editCompanyIDSuccess(response));
  } catch (error) { yield put(companyApiErrorAction()) }
}

function* update_Company({ config }) {             //Update API
  try {
    const response = yield call(updateCompany_ID, config);
    yield put(updateCompanyIDSuccess(response))
  } catch (error) { yield put(companyApiErrorAction()) }
}

/// CompanyGroupDropdown
function* CompanyGroup() {
  try {
    const response = yield call(getCompanyGroup);
    yield put(getCompanyGroupSuccess(response.Data));
  } catch (error) { yield put(companyApiErrorAction()) }
}

function* CompanySaga() {
  yield takeEvery(FETCH_COMPANY_LIST, Get_Company_List_GenFunc);
  yield takeEvery(EDIT_COMPANY_ID, editCompany_ID);
  yield takeEvery(POST_COMPANY_SUBMIT, Save_Method_ForCompany_GenFun);
  yield takeEvery(DELETE_COMPANY_ID, deleteCompany_ID);
  yield takeEvery(UPDATE_COMPANY_ID, update_Company);
  yield takeEvery(GET_COMPANYGROUP, CompanyGroup);

}

export default CompanySaga;
