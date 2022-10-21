import { put, takeEvery } from "redux-saga/effects";
import { AlertState } from "./actions";
import { ALERT_SHOW } from "./actionType";

function* AlertControlFunction({ state }) {
  yield put(AlertState(state));
}

function* Alert_Saga() {
  yield takeEvery(ALERT_SHOW, AlertControlFunction);
}
export default Alert_Saga;
