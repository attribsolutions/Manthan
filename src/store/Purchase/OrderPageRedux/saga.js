import { call, delay, put, takeEvery } from "redux-saga/effects";

import {
  deleteOrderIdSuccess,
  postOrderSuccess,
  editOrderIdSuccess,
  updateOrderIdSuccess,
  getOrderListPageSuccess,
  GoButton_For_Order_AddSuccess,
} from "./actions";
import {
  OrderPage_Update_API,
  OrderPage_Delete_API,
  OrderPage_Post_API,
  OrderPage_GoButton_API,
  OrderList_get_Filter_API,
  OrderPage_Edit_API,
  IBOrderPage_GoButton_API,
  IBOrderList_get_Filter_API,
} from "../../../helpers/backend_helper";

import {
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE,
  POST_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE
} from "./actionType";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { convertDatefunc, convertTimefunc, GoBtnDissable, mainSppinerOnOff, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import *as url from "../../../routes/route_url"

function* goButtonGenFunc(action) {

  yield delay(400)
  try {
    debugger
    const { subPageMode, data } = action
    let response;
    if ((subPageMode === url.ORDER_1) || (subPageMode === url.ORDER_2)) {
      response = yield call(OrderPage_GoButton_API, data); // GO-Botton Purchase Order 1 && 2 Add Page API
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
    else if (subPageMode === url.ORDER_3) {
      response = yield call(IBOrderPage_GoButton_API, data); // GO-Botton IB-invoice Add Page API
    }
    yield put(GoButton_For_Order_AddSuccess(response.Data));
  } catch (error) {
  }
}

function* postOrder_GenFunc({ data }) {
  try {
    const response = yield call(OrderPage_Post_API, data);
    yield put(postOrderSuccess(response));

  } catch (error) {
  }
}

function* editOrderGenFunc({ jsonBody, pageMode }) {

  try {
    const response = yield call(OrderPage_Edit_API, jsonBody);
    response.pageMode = pageMode
    yield put(editOrderIdSuccess(response));
  } catch (error) {

  }
}

function* DeleteOrder_GenFunc({ id }) {

  try {
    const response = yield call(OrderPage_Delete_API, id);

    yield put(deleteOrderIdSuccess(response));
  } catch (error) {

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error DeleteOrder",
    }));
  }
}

function* UpdateOrder_ID_GenFunc({ data, id }) {

  try {
    yield saveDissable(true)
    const response = yield call(OrderPage_Update_API, data, id);
    yield put(updateOrderIdSuccess(response))
    yield saveDissable(false)
  }
  catch (error) {
    yield saveDissable(false)
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error UpdateOrder",
    }));
  }
}

// List Page API
function* orderList_GoBtn_GenFunc(action) {
  try {
debugger
    const { subPageMode, data } = action
    let response;
    let newList;
    if ((subPageMode === url.ORDER_LIST_1) || (subPageMode === url.ORDER_LIST_2)) {
      response = yield call(OrderList_get_Filter_API, data); // GO-Botton Purchase Order 1 && 2 Add Page API
      newList = yield response.Data.map((i) => {

        var date = convertDatefunc(i.OrderDate)
        var time = convertTimefunc(i.CreatedOn)
        var DeliveryDate = convertDatefunc(i.DeliveryDate);
        i["preOrderDate"] = i.OrderDate
        i.OrderDate = (`${date} ${time}`)
        i.DeliveryDate = (`${DeliveryDate}`)

        if ((i.Inward === 0)) {
          i.Inward = "Open"
          i.forceEdit = false
        } else {
          i.Inward = "Close"
          i.forceEdit = true
        }
        return i
      })
      yield put(getOrderListPageSuccess(newList))
    }
    else if (subPageMode === url.ORDER_LIST_3) {
      response = yield call(IBOrderList_get_Filter_API, data); // GO-Botton IB-invoice Add Page API
      yield put(getOrderListPageSuccess(response.Data))
    }
    

    //  try {

    //   const response = yield call(OrderList_get_Filter_API, filters);

    //   const newList = yield response.Data.map((i) => {

    //     var date = convertDatefunc(i.OrderDate)
    //     var time = convertTimefunc(i.CreatedOn)
    //     var DeliveryDate = convertDatefunc(i.DeliveryDate);
    //     i["preOrderDate"] = i.OrderDate
    //     i.OrderDate = (`${date} ${time}`)
    //     i.DeliveryDate = (`${DeliveryDate}`)

    //     if ((i.Inward === 0)) {
    //       i.Inward = "Open"
    //       i.forceEdit = false
    //     } else {
    //       i.Inward = "Close"
    //       i.forceEdit = true
    //     }
    //     return i
    //   })



  } catch (error) {

  }
}

function* OrderPageSaga() {

  yield takeEvery(GO_BUTTON_FOR_ORDER_PAGE, goButtonGenFunc);
  yield takeEvery(POST_ORDER_FROM_ORDER_PAGE, postOrder_GenFunc);
  yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editOrderGenFunc);
  yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenFunc)
  yield takeEvery(DELETE_ORDER_FOR_ORDER_PAGE, DeleteOrder_GenFunc);
  yield takeEvery(GET_ORDER_LIST_PAGE, orderList_GoBtn_GenFunc);
}

export default OrderPageSaga;

