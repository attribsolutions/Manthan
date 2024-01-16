import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_POS_ROLEACCESS,
  SAVE_POS_ROLEACCESS
} from "./actionTypes";
import {
  Post_Category_API,
  get_Category_List_Api,
} from "../../../helpers/backend_helper";
import {
  PosRoleAccessApiErrorAction,
  getPosRoleAccesslistSuccess,
  savePosRoleAccess_Success,
} from "./action";

function* Save_Pos_RoleAccess_GenFun({ config }) {              
  try {
    const response = yield call(Post_Category_API, config);
    yield put(savePosRoleAccess_Success(response));
  } catch (error) { yield put(PosRoleAccessApiErrorAction()) }
}

function* Get_Pos_RoleAccess_GenFun() {                    
  try {
    const response = yield call(get_Category_List_Api);
    yield put(getPosRoleAccesslistSuccess(response.Data));
  } catch (error) { yield put(PosRoleAccessApiErrorAction()) }
}


function* PosRoleAccessSaga() {
  yield takeLatest(SAVE_POS_ROLEACCESS, Save_Pos_RoleAccess_GenFun)
  yield takeLatest(GET_POS_ROLEACCESS, Get_Pos_RoleAccess_GenFun)

}

export default PosRoleAccessSaga;