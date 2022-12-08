import { call, put, takeEvery } from "redux-saga/effects";
import { BOMList_Get_API,  Post_WorkOrder_Master_API,  WorkOrder_GoButton_Post_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getBOMListSuccess, postGoButtonForWorkOrder_MasterSuccess, postWorkOrderMasterSuccess } from "./action";
import { GET_BOM_LIST, POST_GO_BUTTON_FOR_WORK_ORDER_MASTER, POST_WORK_ORDER_MASTER } from "./actionTypes";

// get api
function* Get_BOMList_GenratorFunction({ filters }) {
    
    yield put(SpinnerState(true))
    try {
      
        const response = yield call(BOMList_Get_API,filters );
        yield put(getBOMListSuccess(response.Data));
        yield put(SpinnerState(false))
    } catch (error) {
        yield put(SpinnerState(false))
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message BOMList ",
        }));
    }

}

function* WorkOrderGoButton_post_gunfun({ data }) {

    yield put(SpinnerState(true))
    try {

      const response = yield call(WorkOrder_GoButton_Post_API, data);
      yield put(SpinnerState(false))
      yield put(postGoButtonForWorkOrder_MasterSuccess(response.Data));
     console.log(response.Data)
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Message",
      }));
    }
  }

// Post API
  function* Post_WorkOrder_GenratorFunction({ Data }) {
debugger
    yield put(SpinnerState(true))
    try {
      debugger
      const response = yield call(Post_WorkOrder_Master_API, Data);
      yield put(SpinnerState(false))
      yield put(postWorkOrderMasterSuccess(response));
      console.log("response", response)
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Message post error in Work Order",
      }));
    }
  }

function* WorkOrderSaga() {
    yield takeEvery(GET_BOM_LIST, Get_BOMList_GenratorFunction)
    yield takeEvery(POST_GO_BUTTON_FOR_WORK_ORDER_MASTER, WorkOrderGoButton_post_gunfun)
    yield takeEvery(POST_WORK_ORDER_MASTER, Post_WorkOrder_GenratorFunction)
 
}

export default WorkOrderSaga;