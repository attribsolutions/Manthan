import { call, put, takeLatest } from "redux-saga/effects";
import {
  SWIGGY_ZOMATO_CLAIM_ACTION
} from "./actionType";

import {
  SwiggyZomatoClaim_Action_Success,
  SwiggyZomatoClaim_ErrorAction
} from "./action";

import { SwiggyZomatoClaim_API } from "../../../helpers/backend_helper";
import { numberWithCommas, formatDateRange } from "../../../components/Common/CommonFunction"; // Assuming this path

// Worker saga
function* SwiggyZomatoClaim_GenFunc({ config }) {
  try {
    const response = yield call(SwiggyZomatoClaim_API, config);

    const transformedData = response?.Data.map(item => ({
      ...item,

      recordsAmountTotal: item.ClaimAmount,
    
    }));

    // ✅ Dispatch success with transformed data
    yield put(SwiggyZomatoClaim_Action_Success(transformedData));

  } catch (error) {
    yield put(SwiggyZomatoClaim_ErrorAction(error));
  }
}

// Watcher saga
function* SwiggyZomatoClaimSaga() {
  yield takeLatest(SWIGGY_ZOMATO_CLAIM_ACTION, SwiggyZomatoClaim_GenFunc);
}

export default SwiggyZomatoClaimSaga;
