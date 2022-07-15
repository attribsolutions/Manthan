import { call, put, takeEvery } from "redux-saga/effects";
// import {

//   PostModelsSubmitSuccess,
// } from "./actions";
import {

  postSubmitModules,
} from "../../../helpers/backend_helper";
import {
  POST_MODULES_SUBMIT,
} from "./actionType";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";

function* GetRoles_For_RoleAccess_GenratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(postSubmitModules, data);
    yield put(SpinnerState(false))
    // yield put(PostModelsSubmitSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* RoleAccessSaga() {
  yield takeEvery(POST_MODULES_SUBMIT, GetRoles_For_RoleAccess_GenratorFunction);
}

export default RoleAccessSaga;
