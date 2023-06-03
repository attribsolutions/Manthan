import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteOrderIdSuccess,
  saveOrderActionSuccess,
  editOrderIdSuccess,
  updateOrderIdSuccess,
  getOrderListPageSuccess,
  GoButton_For_Order_AddSuccess,
  orderApprovalActionSuccess,
  getOrderApprovalDetailActionSucc,
} from "./actions";
import {
  OrderPage_Update_API,
  OrderPage_Delete_API,
  OrderPage_Save_API_ForPO,
  OrderPage_GoButton_API,
  OrderList_get_Filter_API,
  IBOrderPage_GoButton_API,
  IBOrderList_get_Filter_API,
  GRN_STP_for_orderList_goBtn,
  IBOrderPage_Save_API,
  orderApproval_Save_API,
  OrderPage_Edit_Get_API,
  OrderPage_Edit_Post_API,
} from "../../../helpers/backend_helper";
import {
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE,
  SAVE_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE,
  ORDER_APPROVAL_ACTION,
  GET_ORDER_APPROVAL_DETAIL
} from "./actionType";
import {  CommonConsole, concatDateAndTime, date_dmy_func, } from "../../../components/Common/CommonFunction";
import *as url from "../../../routes/route_url"


function* goButtonGenFunc({ config }) {                      // GO-Botton order Add Page by subPageMode  

  try {

    const { subPageMode, } = config
    let response;
    if ((subPageMode === url.ORDER_1) || (subPageMode === url.ORDER_2) || (subPageMode === url.ORDER_4)) {
      response = yield call(OrderPage_GoButton_API, config); // GO-Botton Purchase Order 1 && 2 Add Page API
      yield response.Data.OrderItems.forEach((ele, k) => {
        ele["id"] = k + 1
      });
      const termArr = []
      var term = response.Data.TermsAndConditions
      yield term.forEach((ele, k) => {
        termArr.push({
          value: ele.id,
          label: ele.TermsAndCondition,
          IsDeleted: 0
        })
      });

      yield response.Data.TermsAndConditions = termArr;
    }
    else if (subPageMode === url.IB_ORDER) {
      response = yield call(IBOrderPage_GoButton_API, config); // GO-Botton IB-invoice Add Page API
    }
    yield put(GoButton_For_Order_AddSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* saveOrder_GenFunc({ config }) {

  const { subPageMode, btnId, jsonBody } = config;

  let newConfig = config;
  // **************************************** for aorde Sap aproval********************************
  if (subPageMode === url.ORDER_2) {
    newConfig = { jsonBody, btnId: undefined }
  }
  // ********************************************************

  let response = {}
  try {
    if (subPageMode === url.IB_ORDER) {                   // Save  Order  Add Page by subPageMode 
      response = yield call(IBOrderPage_Save_API, newConfig);
    } else {
      response = yield call(OrderPage_Save_API_ForPO, config);
      response.btnId = btnId
    }
    yield put(saveOrderActionSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* editOrderGenFunc({ config }) {     //  Edit Order by subPageMode

  const { btnmode, btnId } = config;
  try {
    let response = yield call(OrderPage_Edit_Post_API, config);
    response.pageMode = btnmode
    response.btnId = btnId
    yield put(editOrderIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* DeleteOrder_GenFunc({ config }) {                  // Delete Order by subPageMode
  try {

    const response = yield call(OrderPage_Delete_API, config);
    yield put(deleteOrderIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* UpdateOrder_ID_GenFunc({ config }) {         // Update Order by subPageMode
  try {
    const response = yield call(OrderPage_Update_API, config);
    yield put(updateOrderIdSuccess(response))
  } catch (error) { CommonConsole(error) }

}

function* orderList_GoBtn_GenFunc({ config }) {
  //  Order List Filter by subPageMode
  try {
    const { subPageMode } = config
    let response;
    let newList;
    if ((subPageMode === url.ORDER_LIST_1) || (subPageMode === url.ORDER_LIST_2) || (subPageMode === url.ORDER_LIST_4)) {
      response = yield call(OrderList_get_Filter_API, config); // GO-Botton Purchase Order 1 && 2 Add Page API
    }
    else if ((subPageMode === url.GRN_STP_1) || subPageMode === url.GRN_STP_3) {
      response = yield call(GRN_STP_for_orderList_goBtn, config); // GO-Botton IB-invoice Add Page API
    }
    else if ((subPageMode === url.IB_ORDER_PO_LIST) || (subPageMode === url.IB_ORDER_SO_LIST) || (subPageMode === url.IB_INVOICE_STP)) {
      response = yield call(IBOrderList_get_Filter_API, config); // GO-Botton IB-invoice Add Page API
    }
    // else if ((subPageMode === url.ORDER_LIST_4)) {
    //   response = yield call(IBOrderList_get_Filter_API, config); // GO-Botton IB-invoice Add Page API
    // }
    newList = yield response.Data.map((i) => {

      i["preOrderDate"] = i.OrderDate
      var DeliveryDate = date_dmy_func(i.DeliveryDate);
      i.OrderDate = concatDateAndTime(i.OrderDate, i.CreatedOn)
      i.DeliveryDate = (`${DeliveryDate}`)





      if (i.Inward === 0) {
        i.Inward = "Open"
        i.forceEditHide = false
      } else {
        i.Inward = "Close"
        i.forceEditHide = true
      }

      if (i.InvoiceCreated === true) {
        i.InvoiceCreated = "Invoice Created"
        i.forceMakeBtn = true
      } else {
        i.InvoiceCreated = ""
        i.forceMakeBtn = false
      }
      if (i.SAPResponse) {// for sap_code order page 

        var numb = i.SAPResponse.match(/\d/g);
        i.SAPResponse = numb.join("");
        i.FullOrderNumber = `${i.FullOrderNumber} (${i.SAPResponse})`//concate sap code and full order number
        i.forceEditHide = true
        i.forceDeleteHide = true
      } else {
        i.forceEditHide = false
        i.forceDeleteHide = false

      }
      return i
    })
    yield put(getOrderListPageSuccess(newList))

  } catch (error) { CommonConsole(error) }
}

function* orderApproval_GenFunc({ config }) {
  try {
    const response = yield call(orderApproval_Save_API, config)
    yield put(orderApprovalActionSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* getOrderApproval_Detail_GenFunc({ config }) {
  try {
    const response = yield call(OrderPage_Edit_Get_API, config)
    response.btnId = config.btnId
    yield put(getOrderApprovalDetailActionSucc(response));
  } catch (error) { CommonConsole(error) }
}

function* OrderPageSaga() {
  yield takeEvery(GO_BUTTON_FOR_ORDER_PAGE, goButtonGenFunc);
  yield takeEvery(SAVE_ORDER_FROM_ORDER_PAGE, saveOrder_GenFunc);
  yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editOrderGenFunc);
  yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenFunc)
  yield takeEvery(DELETE_ORDER_FOR_ORDER_PAGE, DeleteOrder_GenFunc);
  yield takeEvery(GET_ORDER_LIST_PAGE, orderList_GoBtn_GenFunc);
  yield takeEvery(ORDER_APPROVAL_ACTION, orderApproval_GenFunc);
  yield takeEvery(GET_ORDER_APPROVAL_DETAIL, getOrderApproval_Detail_GenFunc);

}

export default OrderPageSaga;

