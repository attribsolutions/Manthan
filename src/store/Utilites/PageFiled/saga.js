import { call, put, takeEvery } from "redux-saga/effects";
import { commonPageFiled_API } from "../../../helpers/backend_helper";
import { COMMON_PAGE_FILED } from "./actionType";
import {
  commonPageFieldSuccess,
  SpinnerState,AlertState
} from "../../actions"

function* commonPageFiled_GenFunc({ pageId }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(commonPageFiled_API, pageId);
debugger
    yield put(commonPageFieldSuccess(response.Data.PageFieldMaster));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* CommonPageField_Saga() {
  yield takeEvery(COMMON_PAGE_FILED, commonPageFiled_GenFunc);
}
export default CommonPageField_Saga;
