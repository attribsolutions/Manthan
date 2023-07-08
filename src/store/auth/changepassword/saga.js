import { call, put, takeLatest } from "redux-saga/effects";
import { ChangePassword_Succes } from "./action";
import { ChangePassword_API } from "../../../helpers/backend_helper";
import { CHANGE_PASSWORD } from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* ChangePassword_GenFun({ config }) {
  try {
    const response = yield call(ChangePassword_API, config);
    yield put(ChangePassword_Succes(response));
  } catch (error) { CommonConsole(error) }
}

function* ChangePasswordSaga() {
  yield takeLatest(CHANGE_PASSWORD, ChangePassword_GenFun)
}

export default ChangePasswordSaga;