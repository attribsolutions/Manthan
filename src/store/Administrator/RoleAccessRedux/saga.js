import { call, put, takeEvery } from "redux-saga/effects";
// import {

//   PostModelsSubmitSuccess,
// } from "./actions";
import {

  PageMasterForRoleAccessLit_Api,

} from "../../../helpers/backend_helper";
import {
  PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST,
} from "./actionType";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { PageMasterForRoleAccessLit_Success } from "./actions";


function* PageMasterForRoleAccessLit_GenratorFunction({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(PageMasterForRoleAccessLit_Api, id);
    yield put(SpinnerState(false))
    yield put(PageMasterForRoleAccessLit_Success(response.Data));
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* RoleAccessSaga() {
  yield takeEvery(PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST, PageMasterForRoleAccessLit_GenratorFunction);
}

export default RoleAccessSaga;
