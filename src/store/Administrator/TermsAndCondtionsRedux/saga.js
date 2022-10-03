import { call, put, takeEvery } from "redux-saga/effects";

import { PostMethod_ForTermsAndCondtionsMasterAPISuccess, } from "./actions";

import {Post_TermsAndCondtions_Master_API, } from "../../../helpers/backend_helper";

import { SpinnerState } from "../../Utilites/Spinner/actions";

import {  POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API, } from "./actionTypes";

import { AlertState } from "../../actions";


// post api
function* Post_Method_ForTermsAndCondtionsMaster_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_TermsAndCondtions_Master_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForTermsAndCondtionsMasterAPISuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}




function* TermsAndCondtionsSaga () {
  yield takeEvery(POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API, Post_Method_ForTermsAndCondtionsMaster_GenFun)


}

export default TermsAndCondtionsSaga;