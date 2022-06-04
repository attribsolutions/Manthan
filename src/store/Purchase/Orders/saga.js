import { call, put, takeEvery } from "redux-saga/effects";
import {
  getOrderListSuccess,
  getOrderPageSuccess,
  getDivisionOrdersSuccess,
  editOrderSuccess,
} from "./actions";
import {
  submitOrderPage,
  getDivisionOrders,
  editOrderID,
  getOrderList,
} from "../../../helpers/backend_helper";
import {
  GET_ORDER_LIST,
  GET_ORDER_PAGE,
  SUBMIT_ORDER_PAGE,
  GET_DIVISIONORDER_LIST,
  EDIT_ORDER,
} from "./actionType";
import  ItemUnits  from "./DemoData";
// import FakeItemListData from "../../Administrator/HPages/DemoData";
import orders from "./DemoData";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
function* fetchOrder_GenratorFunction() {
  try {
    // const response = yield call(getOrderPage);
    const response=orders;
    yield put(getOrderPageSuccess(response.Data));
    //  console.log('$$fetchorder page response$',response)
  } catch (error) {
    console.log("$$fetchorder  saga page error$", error);
  }
}
function* submitOrder({ data }) {
  try {
    //  yield console.log('$$submitOrder page  before response$',data)
    const response = yield call(submitOrderPage, data);
    yield console.log("$$fetchorder page  after response$", response);
    // yield put(submitOrderPageSuccess(response));
  } catch (error) {
    console.log("$$submit order_saga_page  #@ error$", error);
  }
}

function* fetchOrderList(data) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(getOrderList,data);
    yield put(getOrderListSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* EditOrder({ orderId }) {
  try {
     yield console.log('$$EditOrder page  before response$',orderId)
    const response = yield call(editOrderID, orderId);
    yield console.log("$$EditOrder page  after response$", response);
    yield console.log("$$EditOrder page  after ItemUnits$", ItemUnits);

    yield put(editOrderSuccess(ItemUnits));
  } catch (error) {
    console.log("$$EditOrder order_saga_page  #@ error$", error);
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

function* OrdersSaga() {
  yield takeEvery(GET_ORDER_PAGE, fetchOrder_GenratorFunction);
  yield takeEvery(SUBMIT_ORDER_PAGE, submitOrder);
  yield takeEvery(GET_ORDER_LIST, fetchOrderList);
  yield takeEvery(EDIT_ORDER, EditOrder);


  // yield takeEvery(GET_ORDER_LIST_SUCCESS , fetchOrderList)
  yield takeEvery(GET_DIVISIONORDER_LIST, fetchDisvisionOrder);
}

export default OrdersSaga;
