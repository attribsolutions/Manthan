import { call, put, takeEvery } from "redux-saga/effects";

import {
  getOrderListSuccess,
  deleteOrderIdSuccess,
  getSupplierSuccess,
  goButtonSuccess,
  postOrderSuccess,
  editOrderIdSuccess,
  updateOrderIdSuccess,
  getOrderListPageSuccess,
} from "./actions";
import {

  editOrderID_forOrderPage_ApiCall,
  UpdateOrder_ID_ApiCall,
  deleteOrderID_forOrderPage_ApiCall,
  OrderPage_Post_API,
  OrderPage_GetSupplier_API,
  OrderPage_GoButton_API,
  OrderPage_get_API,
  getOrderList_For_Listpage,
  Order_get_API,
} from "../../../helpers/backend_helper";

import {
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE,
  POST_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE,Unit
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";


function* goButtonGenFunc({ data, hasEditVal }) {
  
  yield put(SpinnerState(true))
  try {
    const response = yield call(OrderPage_GoButton_API, data);
    if (hasEditVal) {
      response.Data.forEach(element => {
        hasEditVal.OrderItem.forEach(ele => {
          if (element.id === ele.Item) {
            element["inpRate"] = ele.Rate
            element["inpQty"] = ele.Quantity
            element["totalAmount"] = ele.Amount
            element["UOM"] = ele.Unit
            element["UOMLabel"] = ele.UnitName
            element["inpBaseUnitQty"] = ele.BaseUnitQuantity

          }
        })
      });
    }
    yield put(goButtonSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Go Button-Order Page",
    }));
  }
}

function* postOrder_GenFunc({ data }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(OrderPage_Post_API, data);
    yield put(postOrderSuccess(response));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Post Order",
    }));
  }
}

function* editOrderGenFunc({ id, pageMode }) {
  
  yield put(SpinnerState(true))
  try {
    const response = yield call(editOrderID_forOrderPage_ApiCall, id);
    response.pageMode = pageMode
    yield put(SpinnerState(false))
    yield put(editOrderIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Edit Order",
    }));
  }
}

function* DeleteOrder_GenFunc({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(deleteOrderID_forOrderPage_ApiCall, id);
    yield put(SpinnerState(false))
    yield put(deleteOrderIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error DeleteOrder",
    }));
  }
}

function* UpdateOrder_ID_GenFunc({ data, id }) {

  try {
    yield put(SpinnerState(true))
    const response = yield call(UpdateOrder_ID_ApiCall, data, id);
    yield put(SpinnerState(false))
    yield put(updateOrderIdSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error UpdateOrder",
    }));
  }
}

// List Page API
function* get_OrderList_GenFunc({ filters }) {
  
  yield put(SpinnerState(true))
  try {
    const response = yield call(Order_get_API, filters);
    yield put(SpinnerState(false))
    yield put(getOrderListPageSuccess(response.Data))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error  Get OrderList",
    }));
  }
}

function* OrderPageSaga() {

  yield takeEvery(GO_BUTTON_FOR_ORDER_PAGE, goButtonGenFunc);
  yield takeEvery(POST_ORDER_FROM_ORDER_PAGE, postOrder_GenFunc);
  yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editOrderGenFunc);
  yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenFunc)
  yield takeEvery(DELETE_ORDER_FOR_ORDER_PAGE, DeleteOrder_GenFunc);
  yield takeEvery(GET_ORDER_LIST_PAGE, get_OrderList_GenFunc);
}

export default OrderPageSaga;
