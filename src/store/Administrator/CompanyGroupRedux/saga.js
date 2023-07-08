import { call, put, takeLatest } from "redux-saga/effects";
import {
  saveCompanyGroupMasterSuccess,
  getCompanyGroupListSuccess,
  deleteCompanyGroupIDSuccess,
  editCompanyGroupSuccess,
  updateCompanyGroupIDSuccess,
  companyGroupApiErrorAction
} from "./action";
import {
  CompanyGroup_Get_API,
  CompanyGroup_Post_API,
  CompanyGroup_Delete_API,
  CompanyGroup_edit_API,
  CompanyGroup_update_API,
} from "../../../helpers/backend_helper";
import {
  SAVE_COMPANY_GROUP_MASTER,
  GET_COMPANY_GROUP_LIST,
  DELETE_COMPANY_GROUP_ID,
  EDIT_COMPANY_GROUP_ID,
  UPDATE_COMPANY_GROUP_ID
} from "./actionType";


function* Get_CompanyGroup_GenratorFunction() {//get API
  try {
    const response = yield call(CompanyGroup_Get_API);
    yield put(getCompanyGroupListSuccess(response.Data));
  } catch (error) { yield put(companyGroupApiErrorAction()) }
}

function* Post_Method_For_CompanyGroup_GenFun({ config }) { //Post API
  try {
    const response = yield call(CompanyGroup_Post_API, config);
    yield put(saveCompanyGroupMasterSuccess(response));
  } catch (error) { yield put(companyGroupApiErrorAction()) }
}

function* Edit_CompanyGroupType_ID_GenratorFunction({ config }) { // Edit API
  const { btnmode } = config;
  try {
    const response = yield call(CompanyGroup_edit_API, config);
    response.pageMode = btnmode;
    yield put(editCompanyGroupSuccess(response));
  } catch (error) { yield put(companyGroupApiErrorAction()) }
}

function* Update_CompanyGroupType_ID_GenratorFunction({ config }) { // Update API
  try {
    const response = yield call(CompanyGroup_update_API, config);
    yield put(updateCompanyGroupIDSuccess(response))
  } catch (error) { yield put(companyGroupApiErrorAction()) }
}

function* Delete_CompanyGroupType_ID_GenratorFunction({ config }) { //Delete API
  try {
    const response = yield call(CompanyGroup_Delete_API, config);
    yield put(deleteCompanyGroupIDSuccess(response))
  } catch (error) { yield put(companyGroupApiErrorAction()) }
}

function* CompanyGroupSaga() {
  yield takeLatest(SAVE_COMPANY_GROUP_MASTER, Post_Method_For_CompanyGroup_GenFun)
  yield takeLatest(GET_COMPANY_GROUP_LIST, Get_CompanyGroup_GenratorFunction)
  yield takeLatest(EDIT_COMPANY_GROUP_ID, Edit_CompanyGroupType_ID_GenratorFunction)
  yield takeLatest(UPDATE_COMPANY_GROUP_ID, Update_CompanyGroupType_ID_GenratorFunction)
  yield takeLatest(DELETE_COMPANY_GROUP_ID, Delete_CompanyGroupType_ID_GenratorFunction)
}

export default CompanyGroupSaga;