import { Breadcrumb } from "reactstrap";
import { put, takeEvery, select } from "redux-saga/effects";
import { AlertState, CommonBreadcrumbDetails_reducer } from "./actions";
import { ALERT_SHOW, COMMON_BREADCRUMB_ALL_DETAIL, COMMON_BREADCRUMB_ALL_DETAIL_redux } from "./actionType";

function* AlertControlFunction({ props }) {
  debugger
  try{
    const selectAllState = (state) => state.BreadcrumbReducer;
    const tmp = yield select(selectAllState);
    console.log(tmp);
      yield put(CommonBreadcrumbDetails_reducer( props ))
    } catch(e){
      debugger
    }
}

function* Breadcrumb_Saga() {
  yield takeEvery(COMMON_BREADCRUMB_ALL_DETAIL_redux, AlertControlFunction);
}
export default Breadcrumb_Saga;
