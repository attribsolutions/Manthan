import { call, put, takeEvery } from "redux-saga/effects";
import {
  getOrderListSuccess,
  getDivisionOrdersSuccess,
  editOrderSuccess,
  getOrderItems_ForOrderPageSuccess,
  updateOrderID_From_OrderPageSuccess,
  submitOrder_fromOrderPage_Success,
} from "./actions";
import {
  getDivisionOrders,
  getOrderItems_forOrderPage_ApiCall,
  getOrderList_forOrderPage_ApiCall,
  editOrderID_forOrderPage_ApiCall,
  submitOrder_From_OrderPage_apiCall,
  UpdateOrder_ID_ApiCall,
} from "../../../helpers/backend_helper";
import {
  GET_ORDER_LIST,
  GET_ORDER_ITEMS_FOR_ORDER_PAGE,
  GET_DIVISIONORDER_LIST,
  EDIT_ORDER,
  SUBMIT_ORDER_FROM_ORDER_PAGE,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
} from "./actionType";
import ItemUnits from "./DemoData";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";


function* fetchOrderItems_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(getOrderItems_forOrderPage_ApiCall);
    yield put(getOrderItems_ForOrderPageSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* submitOrder_GenratorFunction({data}) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(submitOrder_From_OrderPage_apiCall,data);
    debugger
    yield put(submitOrder_fromOrderPage_Success(response));
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
    const response = yield call(getOrderList_forOrderPage_ApiCall, data);
    yield put(getOrderListSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* EditOrder({ orderId }) {
  try {
    yield console.log('$$EditOrder page  before response$', orderId)
    const response = yield call(editOrderID_forOrderPage_ApiCall, orderId);
    yield console.log("$$EditOrder page  after response$", response);
    yield console.log("$$EditOrder page  after ItemUnits$", ItemUnits);

    yield put(editOrderSuccess(ItemUnits));
  } catch (error) {
    console.log("$$EditOrder order_saga_page  #@ error$", error);
  }
}

function* UpdateOrder_ID_GenratorFunction({ data, id }) {
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


function* fetchDisvisionOrder() {
  try {
    const response = yield call(getDivisionOrders);
    yield console.log("$$fetchDisvisionOrder   after response$", response);
    yield put(getDivisionOrdersSuccess(response));
  } catch (error) {
    console.log("$$fetchOrderList_saga  #@ error$", error);
  }
}

function* OrderPageSaga() {
  yield takeEvery(GET_ORDER_ITEMS_FOR_ORDER_PAGE, fetchOrderItems_GenratorFunction);
  yield takeEvery(SUBMIT_ORDER_FROM_ORDER_PAGE, submitOrder_GenratorFunction);
  yield takeEvery(GET_ORDER_LIST, fetchOrderList);
  yield takeEvery(EDIT_ORDER, EditOrder);
  yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenratorFunction)

  yield takeEvery(GET_DIVISIONORDER_LIST, fetchDisvisionOrder);
}

export default OrderPageSaga;
