import { call, put, takeEvery } from "redux-saga/effects";
import {
  ChangePassword_Succes,s
} from "./action";
import {
  ChangePassword_API,
} from "../../../helpers/backend_helper";
import {
  CHANGE_PASSWORD,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* ChangePassword_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ChangePassword_API, config);
    yield put(ChangePassword_Succes(response));
  } catch (error) { CommonConsole(error) }
}



function* GroupSaga() {
  yield takeEvery(CHANGE_PASSWORD, ChangePassword_GenFun)
}

export default GroupSaga;