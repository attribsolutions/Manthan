import { put, takeLatest } from "redux-saga/effects";
import { customAlert } from "./actions";
import { ALERT_SHOW } from "./actionType";

function* AlertControlFunction({ state }) {
  yield put(customAlert(state));
}

function* Alert_Saga() {
  yield takeLatest(ALERT_SHOW, AlertControlFunction);
}
export default Alert_Saga;
