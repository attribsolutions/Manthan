import { call, put, takeEvery } from "redux-saga/effects";

import {
  postTermAndConditionSuccess,
  getTermAndCondition_Success,
  DeleteTermsAndCondtions_Success,
  EditTermsAndCondtions_Success,
  UpdateTermsAndCondtions_Success
} from "./actions";

import {
  Post_TermsAndCondtions_Master_API,
  get_TermsAndCondtionsList_API,
  del_TermsAndCondtions_Master_API,
  edit_TermsAndCondtions_Master_API,
  update_TermsAndCondtions_Master_API
} from "../../../helpers/backend_helper";

import { SpinnerState } from "../../Utilites/Spinner/actions";

import {
  POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
  GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
  DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
  EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
  UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API
} from "./actionTypes";

import { AlertState } from "../../actions";


// post api
function* Post_Method_ForTermsAndCondtionsMaster_GenFun({ data }) {

  try {
    const response = yield call(Post_TermsAndCondtions_Master_API, data);
   
    yield put(postTermAndConditionSuccess(response));
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// Get List Page API
function* Get_TermsAndCondtions_GenratorFunction() {


  try {
    const response = yield call(get_TermsAndCondtionsList_API);
    yield put(getTermAndCondition_Success(response.Data));
   
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete api 
function* Delete_TermsAndCondtions_GenratorFunction({id }) {
  try {
  
    const response = yield call(del_TermsAndCondtions_Master_API, id);
   
    yield put(DeleteTermsAndCondtions_Success(response))
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_TermsAndCondtions_GenratorFunction({ id,pageMode }) {
  
  try {
    const response = yield call(edit_TermsAndCondtions_Master_API, id);
    response.pageMode=pageMode
    yield put(EditTermsAndCondtions_Success(response));
    
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* update_TermsAndCondtions_GenratorFunction({ updateData, ID }) {
  
  try {
  
    const response = yield call(update_TermsAndCondtions_Master_API, updateData, ID);
   
    yield put(UpdateTermsAndCondtions_Success(response))
  }
  catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* TermsAndConditionsSaga() {
  yield takeEvery(POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API, Post_Method_ForTermsAndCondtionsMaster_GenFun)
  yield takeEvery(GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Get_TermsAndCondtions_GenratorFunction)
  yield takeEvery(DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Delete_TermsAndCondtions_GenratorFunction)
  yield takeEvery(EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Edit_TermsAndCondtions_GenratorFunction)
  yield takeEvery(UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API, update_TermsAndCondtions_GenratorFunction)
}

export default TermsAndConditionsSaga;