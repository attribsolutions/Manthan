import { call, put, takeLatest } from "redux-saga/effects";
import { date_dmy_func, convertTimefunc } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";
import {
  Post_Bulk_BOM_For_WorkOrder_API,
  Post_WorkOrder_Master_API,
  WorkOrder_Delete_Api,
  WorkOrder_edit_Api,
  WorkOrder_Get_API,
  WorkOrder_GoButton_Post_API,
  WorkOrder_Update_Api
} from "../../../helpers/backend_helper";
import {
  Bulk_BOM_for_WorkOrderSuccess,
  deleteWorkOrderIdSuccess,
  editWorkOrderListSuccess,
  getWorkOrderListPageSuccess,
  postGoButtonForWorkOrder_MasterSuccess,
  Save_Bulk_BOM_for_WorkOrderSuccess,
  SaveWorkOrderMasterSuccess,
  updateWorkOrderListSuccess,
  WorkOrderApiErrorAction
} from "./action";
import {
  BULK_BOM_FOR_WORKORDER,
  DELETE_WORK_ORDER_LIST_PAGE,
  EDIT_WORK_ORDER_LIST_ID,
  GET_WORK_ORDER_LIST_PAGE,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
  POST_WORK_ORDER_MASTER,
  SAVE_BULK_BOM_FOR_WORKORDER,
  UPDATE_WORK_ORDER_LIST
} from "./actionTypes";
import { url } from "../../../routes";

function* GoButton_WorkOrder_post_genfun({ jsonbody }) {     // GO Botton Post API
  try {

    const response = yield call(WorkOrder_GoButton_Post_API, jsonbody);
    response.Data.BOMItems.forEach(item => {
      item.StockQuantity = item.StockQuantity.toFixed(2);
    });
    yield put(postGoButtonForWorkOrder_MasterSuccess(response));
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}

function* Post_WorkOrder_GenratorFunction({ config }) {     // WOrk Order Post API
  try {
    const response = yield call(Post_WorkOrder_Master_API, config);
    yield put(SaveWorkOrderMasterSuccess(response));
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}



function* Save_Bulk_BOM_For_WorkOrder_GenratorFunction({ config }) {     // WOrk Order Post API
  try {
    const response = yield call(Post_WorkOrder_Master_API, config);
    yield put(Save_Bulk_BOM_for_WorkOrderSuccess(response));
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}




function* Bulk_BOM_For_WorkOrder_GenratorFunction({ config }) {     // WOrk Order Post API
  
  try {
    let response = yield call(Post_Bulk_BOM_For_WorkOrder_API, config);


    let NewResponse = yield response.Data.map((inx_1) => {
      inx_1.Number_Lots = 1 /// Initilal   Number_Lots  will be 1 
      inx_1.Qty = inx_1.Number_Lots * Number(inx_1.EstimatedOutputQty)
      return inx_1;
    })
    response.Data = NewResponse
    yield put(Bulk_BOM_for_WorkOrderSuccess(response));
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}


function* GetWorkOrderGenFunc({ filters }) {
  const { subPageMode, jsonBody } = filters
  let newList
  // get Work Order List API Using post method
  try {
    const response = yield call(WorkOrder_Get_API, jsonBody);

    newList = yield response.Data.map((i) => {
      i.WorkDate = i.WorkOrderDate;
      var date = date_dmy_func(i.WorkOrderDate)
      var time = convertTimefunc(i.CreatedOn)
      i.WorkOrderDate = (`${date} ${time}`)
      if (i.Status === 0) {
        i.Status = "Open";
      }
      else if (i.Status === 1) {
        i.Status = "Partially Completed";
      }
      else if (i.Status === 2) {
        i.Status = "Completed";
      }
      else if (i.Status === 3) {
        i.Status = "Close";
      }
      return i
    })
    if (subPageMode === url.MATERIAL_ISSUE_STP) {

      newList = response.Data.filter((i) => {
        return !(i.Status === "Completed")
      })
    }

    yield put(getWorkOrderListPageSuccess(newList));
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}

function* editWorkOrderGenFunc({ config }) {     // Work Order edit List page
  const { btnmode } = config;
  try {
    let response = yield call(WorkOrder_edit_Api, config);
    response.pageMode = btnmode;

    response.Data = response.Data[0];
    if (response.StatusCode === 226) {
      customAlert({
        Type: 3,
        Status: true,
        Message: response.Message,
      })
      yield put(editWorkOrderListSuccess({ Status: false }))
      return

    }
    else {
      yield put(editWorkOrderListSuccess(response));
    }
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}

function* UpdateWorkOrderGenFunc({ config }) {     // Work Order update List page
  try {
    const response = yield call(WorkOrder_Update_Api, config);
    yield put(updateWorkOrderListSuccess(response))
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}

function* DeleteWorkOrderGenFunc({ config }) {       // Work Order delete List page
  try {
    const response = yield call(WorkOrder_Delete_Api, config);
    yield put(deleteWorkOrderIdSuccess(response));
  } catch (error) { yield put(WorkOrderApiErrorAction()) }
}

function* WorkOrderSaga() {
  yield takeLatest(POST_GO_BUTTON_FOR_WORK_ORDER_MASTER, GoButton_WorkOrder_post_genfun)
  yield takeLatest(POST_WORK_ORDER_MASTER, Post_WorkOrder_GenratorFunction)
  yield takeLatest(SAVE_BULK_BOM_FOR_WORKORDER, Save_Bulk_BOM_For_WorkOrder_GenratorFunction)
  yield takeLatest(GET_WORK_ORDER_LIST_PAGE, GetWorkOrderGenFunc)
  yield takeLatest(EDIT_WORK_ORDER_LIST_ID, editWorkOrderGenFunc)
  yield takeLatest(UPDATE_WORK_ORDER_LIST, UpdateWorkOrderGenFunc)
  yield takeLatest(DELETE_WORK_ORDER_LIST_PAGE, DeleteWorkOrderGenFunc)

  yield takeLatest(BULK_BOM_FOR_WORKORDER, Bulk_BOM_For_WorkOrder_GenratorFunction)

}

export default WorkOrderSaga;