import { useDispatch } from "react-redux";
import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, convertDatefunc, convertTimefunc, GoBtnDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  BOMList_Get_API,
  Post_WorkOrder_Master_API,
  WorkOrder_Delete_Api,
  WorkOrder_edit_Api,
  WorkOrder_Get_API,
  WorkOrder_GoButton_Post_API,
  WorkOrder_Update_Api
} from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  deleteWorkOrderIdSuccess,
  editWorkOrderListSuccess,
  getBOMListSuccess,
  getWorkOrderListPageSuccess,
  postGoButtonForWorkOrder_MasterSuccess,
  SaveWorkOrderMasterSuccess,
  updateWorkOrderListSuccess
} from "./action";
import {
  DELETE_WORK_ORDER_LIST_PAGE,
  EDIT_WORK_ORDER_LIST_ID,
  GET_BOM_LIST,
  GET_WORK_ORDER_LIST_PAGE,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
  POST_WORK_ORDER_MASTER,
  UPDATE_WORK_ORDER_LIST
} from "./actionTypes";

// get Item dropdown API using post method
function* Get_BOMList_GenratorFunction({ filters }) {
  try {
    const response = yield call(BOMList_Get_API, filters);
    yield put(getBOMListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// GO Botton Post API
function* GoButton_WorkOrder_post_genfun({ jsonbody, btnId }) {
  try {
    const response = yield call(WorkOrder_GoButton_Post_API, jsonbody);
    // GoBtnDissable({ id: btnId, state: false })
    yield put(postGoButtonForWorkOrder_MasterSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// WOrk Order Post API
function* Post_WorkOrder_GenratorFunction({ jsonbody, btnId }) {
  try {
    const response = yield call(Post_WorkOrder_Master_API, jsonbody);
    yield put(SaveWorkOrderMasterSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get Work Order List API Using post method
function* GetWorkOrderGenFunc({ filters }) {
  try {
    const response = yield call(WorkOrder_Get_API, filters);
    const newList = yield response.Data.map((i) => {
      i.WorkDate = i.WorkOrderDate;
      var date = convertDatefunc(i.WorkOrderDate)
      var time = convertTimefunc(i.CreatedOn)
      i.WorkOrderDate = (`${date} ${time}`)
      return i
    })
    yield put(getWorkOrderListPageSuccess(newList));
  } catch (error) { CommonConsole(error) }
}

// Work Order edit List page
function* editWorkOrderGenFunc({ id1, pageMode }) {
  try {
    let response = yield call(WorkOrder_edit_Api, id1);
    response.pageMode = pageMode
    response.Data = response.Data[0];
    if (response.StatusCode === 226) yield put(AlertState({
      Type: 3,
      Status: true, Message: response.Message,
    }));
    else {
      yield put(editWorkOrderListSuccess(response));
    }
  } catch (error) { CommonConsole(error) }
}

// Work Order update List page
function* UpdateWorkOrderGenFunc({ data, id1 }) {
  try {
    const response = yield call(WorkOrder_Update_Api, data, id1);
    yield put(updateWorkOrderListSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// Work Order delete List page
function* DeleteWorkOrderGenFunc({ id }) {
  try {
    const response = yield call(WorkOrder_Delete_Api, id);
    yield put(deleteWorkOrderIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* WorkOrderSaga() {
  yield takeEvery(GET_BOM_LIST, Get_BOMList_GenratorFunction)
  yield takeEvery(POST_GO_BUTTON_FOR_WORK_ORDER_MASTER, GoButton_WorkOrder_post_genfun)
  yield takeEvery(POST_WORK_ORDER_MASTER, Post_WorkOrder_GenratorFunction)
  yield takeEvery(GET_WORK_ORDER_LIST_PAGE, GetWorkOrderGenFunc)
  yield takeEvery(EDIT_WORK_ORDER_LIST_ID, editWorkOrderGenFunc)
  yield takeEvery(UPDATE_WORK_ORDER_LIST, UpdateWorkOrderGenFunc)
  yield takeEvery(DELETE_WORK_ORDER_LIST_PAGE, DeleteWorkOrderGenFunc)
}

export default WorkOrderSaga;