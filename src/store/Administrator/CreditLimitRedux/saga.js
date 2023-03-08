import { call, delay, put, takeEvery } from "redux-saga/effects";
import {
  postCreditLimitSuccess,
  GoButton_For_CreditLimit_AddSuccess,
} from "./actions";
import {
  CreditLimit_GoButton_Post_API,
  Post_CreditLimit_Master_API,
} from "../../../helpers/backend_helper";
import {
  GO_BUTTON_FOR_CREDITLIMIT_PAGE,
  POST_CREDITLIMIT_PAGE,
} from "./actionTypes";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* GoButton_CreditLimit_post_genfun({ jsonBody }) {

  try {
    const response = yield call(CreditLimit_GoButton_Post_API, jsonBody);
    yield put(GoButton_For_CreditLimit_AddSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Credit Limit Post API
function* Post_CreditLimit_GenratorFunction({ jsonBody }) {
  debugger
  try {
    const response = yield call(Post_CreditLimit_Master_API, jsonBody);
    yield put(postCreditLimitSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* CreditLimitSaga() {
  yield takeEvery(GO_BUTTON_FOR_CREDITLIMIT_PAGE, GoButton_CreditLimit_post_genfun);
  yield takeEvery(POST_CREDITLIMIT_PAGE, Post_CreditLimit_GenratorFunction);
}

export default CreditLimitSaga;

