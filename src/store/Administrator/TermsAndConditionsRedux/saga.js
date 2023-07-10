import { call, put, takeLatest } from "redux-saga/effects";

import {
  saveTermAndConditionSuccess,
  getTermAndCondition_Success,
  DeleteTermsAndCondtions_Success,
  EditTermsAndCondtions_Success,
  UpdateTermsAndCondtions_Success,
  TermsAndConditionsApiErrorAction
} from "./actions";

import {
  Post_TermsAndCondtions_Master_API,
  get_TermsAndCondtionsList_API,
  del_TermsAndCondtions_Master_API,
  edit_TermsAndCondtions_Master_API,
  update_TermsAndCondtions_Master_API
} from "../../../helpers/backend_helper";

import {
  POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
  GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
  DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
  EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
  UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API
} from "./actionTypes";

import { CommonConsole } from "../../../components/Common/CommonFunction";


// post api
function* Save_Method_ForTermsAndCondtionsMaster_GenFun({ config }) {
  try {
    const response = yield call(Post_TermsAndCondtions_Master_API, config);
    yield put(saveTermAndConditionSuccess(response));
  } catch (error) { yield put(TermsAndConditionsApiErrorAction()) }
}


// Get List Page API
function* Get_TermsAndCondtions_GenratorFunction() {
  try {
    const response = yield call(get_TermsAndCondtionsList_API);
    yield put(getTermAndCondition_Success(response.Data));
  } catch (error) { yield put(TermsAndConditionsApiErrorAction()) }
}

// delete api 
function* Delete_TermsAndCondtions_GenratorFunction({config }) {
  try {
    const response = yield call(del_TermsAndCondtions_Master_API, config);
    yield put(DeleteTermsAndCondtions_Success(response))
  } catch (error) { yield put(TermsAndConditionsApiErrorAction()) }
}


// edit api
function* Edit_TermsAndCondtions_GenratorFunction({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(edit_TermsAndCondtions_Master_API, config);
    response.pageMode = btnmode;
    yield put(EditTermsAndCondtions_Success(response));
  } catch (error) { yield put(TermsAndConditionsApiErrorAction()) }
}

// update api
function* update_TermsAndCondtions_GenratorFunction({ config }) {
  
  try {
    const response = yield call(update_TermsAndCondtions_Master_API, config);
    yield put(UpdateTermsAndCondtions_Success(response))
  } catch (error) { yield put(TermsAndConditionsApiErrorAction()) }
}


function* TermsAndConditionsSaga() {
  yield takeLatest(POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API, Save_Method_ForTermsAndCondtionsMaster_GenFun)
  yield takeLatest(GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Get_TermsAndCondtions_GenratorFunction)
  yield takeLatest(DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Delete_TermsAndCondtions_GenratorFunction)
  yield takeLatest(EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Edit_TermsAndCondtions_GenratorFunction)
  yield takeLatest(UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API, update_TermsAndCondtions_GenratorFunction)
}

export default TermsAndConditionsSaga;