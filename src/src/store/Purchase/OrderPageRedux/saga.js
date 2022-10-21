import { call, put, takeEvery } from "redux-saga/effects";

import {
  getOrderListSuccess,
  updateOrderID_From_OrderPageSuccess,
  editOrder_forOrderPage_Success,
  deleteOrderID_From_OrderPageSuccess,
  getSupplierSuccess,
  goButtonSuccess,
  postOrderSuccess,
} from "./actions";
import {

  editOrderID_forOrderPage_ApiCall,
  UpdateOrder_ID_ApiCall,
  deleteOrderID_forOrderPage_ApiCall,
  OrderPage_Post_API,
  OrderPage_GetSupplier_API,
  OrderPage_GoButton_API,
  OrderPage_get_API,
} from "../../../helpers/backend_helper";
import {
  GET_ORDER_LIST,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  GET_SUPPLIER,
  GO_BUTTON_FOR_ORDER_PAGE,
  POST_ORDER_FROM_ORDER_PAGE,
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";


function* getSupplierGenFunc() {

  const USER = JSON.parse(localStorage.getItem("roleId"))
  try {
    const response = yield call(OrderPage_GetSupplier_API, USER.Party_id
    );
    yield put(getSupplierSuccess(response.Data));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message for getSupplier ",
    }));
  }
}

function* goButtonGenFunc({ data }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(OrderPage_GoButton_API, data);
    yield put(goButtonSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* postOrder_GenFunc({ data }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(OrderPage_Post_API, data);
    yield put(postOrderSuccess(response));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* fetchOrderList(data) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(OrderPage_get_API, data);
    if (response.StatusCode === 200) yield put(getOrderListSuccess(response.Data));
    else alert(" response error")
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* EditOrder_GenratorFunction({ id }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(editOrderID_forOrderPage_ApiCall, id);
    yield put(SpinnerState(false))
    debugger
    yield put(editOrder_forOrderPage_Success(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* DeleteOrder_GenratorFunction({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(deleteOrderID_forOrderPage_ApiCall, id);
    yield put(SpinnerState(false))
    yield put(deleteOrderID_From_OrderPageSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* UpdateOrder_ID_GenratorFunction({ data, id }) {
  debugger
  try {
    yield put(SpinnerState(true))
    const response = yield call(UpdateOrder_ID_ApiCall, data, id);
    yield put(SpinnerState(false))
    yield put(updateOrderID_From_OrderPageSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* OrderPageSaga() {
  yield takeEvery(GET_SUPPLIER, getSupplierGenFunc);
  yield takeEvery(GO_BUTTON_FOR_ORDER_PAGE, goButtonGenFunc);
  yield takeEvery(POST_ORDER_FROM_ORDER_PAGE, postOrder_GenFunc);
  yield takeEvery(GET_ORDER_LIST, fetchOrderList);
  yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, EditOrder_GenratorFunction);
  yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenratorFunction)

  yield takeEvery(DELETE_ORDER_FOR_ORDER_PAGE, DeleteOrder_GenratorFunction);
}

export default OrderPageSaga;
