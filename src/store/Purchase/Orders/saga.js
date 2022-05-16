import { call, put, takeEvery } from "redux-saga/effects";
import {
  getOrderListSuccess,
  getOrderPageSuccess,
  getDivisionOrdersSuccess,
  editOrderSuccess,
} from "./actions";
import {
  getOrderList,
  getOrderPage,
  submitOrderPage,
  getDivisionOrders,
  editOrderID,
} from "../../../helpers/backend_helper";
import {
  GET_ORDER_LIST,
  GET_ORDER_PAGE,
  SUBMIT_ORDER_PAGE,
  GET_DIVISIONORDER_LIST,
  EDIT_ORDER,
} from "./actionType";
import  ItemUnits  from "./DemoData";
import FakeItemListData from "../../Administrator/HPages/DemoData";
import orders from "./DemoData";
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

function* fetchOrderList({ listData }) {
  try {
    // yield console.log('$$fetchOrderList  before response$',listData)
    // const response = yield call(getOrderList, listData);
    const response = FakeItemListData;
   
    if (response.Msg) {
      // arr.push(response);
      // yield   console.log('$$fetchOrderList Ifloop  after response$',response);
      console.log(response)
      yield put(getOrderListSuccess(response));
    } else {
      yield put(getOrderListSuccess(response));
      // yield   console.log('$$fetchOrderList lseloop  after response$',response);
    }
  } catch (error) {
    console.log("$$fetchOrderList_saga  #@ error$", error);
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
