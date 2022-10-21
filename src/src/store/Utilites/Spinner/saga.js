import { put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "./actions";
import { SPINNER_ON } from "./actionType";

function* Spinner_ControlFunction({ state }) {
  yield put(SpinnerState(state));
}

function* Spinner_Saga() {
  yield takeEvery(SPINNER_ON,Spinner_ControlFunction);
}
export default Spinner_Saga;
