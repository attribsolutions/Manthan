import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_POS_ROLEACCESS,
  SAVE_POS_ROLEACCESS
} from "./actionTypes";
import {
  PosRoleAccessApiErrorAction,
  getPosRoleAccesslistSuccess,
  savePosRoleAccess_Success,
} from "./action";
import { Post_POSRoleAccess_API, get_POSRoleAccess_List_Api } from "../../../../helpers/backend_helper";

function* Save_Pos_RoleAccess_GenFun({ config }) {
  try {
    const response = yield call(Post_POSRoleAccess_API, config);
    yield put(savePosRoleAccess_Success(response));
  } catch (error) { yield put(PosRoleAccessApiErrorAction()) }
}

function* Get_Pos_RoleAccess_GenFun() {

  try {
    const response = yield call(get_POSRoleAccess_List_Api);
    response.Data.forEach(i => {
      for (let key in i) {
        if (i.hasOwnProperty(key) && i[key] === null) {
          i[key] = 0;
        } else if (i.hasOwnProperty(key) && i[key] === true) {
          i[key] = 1;
        } else if (i.hasOwnProperty(key) && i[key] === false) {
          i[key] = 0;
        }
      }
    });
    yield put(getPosRoleAccesslistSuccess(response.Data));
  } catch (error) { yield put(PosRoleAccessApiErrorAction()) }
}


function* PosRoleAccessSaga() {
  yield takeLatest(SAVE_POS_ROLEACCESS, Save_Pos_RoleAccess_GenFun)
  yield takeLatest(GET_POS_ROLEACCESS, Get_Pos_RoleAccess_GenFun)

}

export default PosRoleAccessSaga;