import { call, put, takeEvery } from "redux-saga/effects";

import { DeleteTermsAndCondtions_Success,postTermAndConditionSuccess, getTermAndCondition, getTermAndCondition_Success} from "./actions";

import {Post_TermsAndCondtions_Master_API,get_TermsAndCondtionsList_API,delete_TermsAndCondtions_API } from "../../../helpers/backend_helper";

import { SpinnerState } from "../../Utilites/Spinner/actions";

import {  DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API } from "./actionTypes";

import { AlertState } from "../../actions";


// post api
function* Post_Method_ForTermsAndCondtionsMaster_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_TermsAndCondtions_Master_API, data);
    yield put(SpinnerState(false))
    yield put(postTermAndConditionSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// Get List Page API
function* Get_TermsAndCondtions_GenratorFunction() {
  
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_TermsAndCondtionsList_API);
    
    yield put(getTermAndCondition_Success(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete List Page API
// function* Delete_TermsAndCondtions_GenratorFunction({id}) {
//   debugger
//   yield put(SpinnerState(true))
//   try {
//     const response = yield call(delete_TermsAndCondtions_API,id);
    
//     yield put(DeleteTermsAndCondtions_Success(response));
//     yield put(SpinnerState(false))
//   } catch (error) {
//     yield put(SpinnerState(false))
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error Message",
//     }));
//   }
// }


function* TermsAndCondtionsSaga () {
  yield takeEvery(POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API, Post_Method_ForTermsAndCondtionsMaster_GenFun)
  yield takeEvery(GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Get_TermsAndCondtions_GenratorFunction)
  // yield takeEvery(DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API, Delete_TermsAndCondtions_GenratorFunction)

}

export default TermsAndCondtionsSaga;