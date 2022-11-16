import { call, put, takeEvery } from "redux-saga/effects";

import {

  getGRNListPageSuccess,
  getOrderListPageSuccess,
} from "./actions";
import {


  getOrderList_For_Listpage, GRN_get_API,
} from "../../../helpers/backend_helper";

import {
  GET_GRN_LIST_PAGE,
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";


// function* goButtonGenFunc({ data, hasEditVal }) {

//   yield put(SpinnerState(true))
//   try {
//     const response = yield call(OrderPage_GoButton_API, data);
//     if (hasEditVal) {
//       response.Data.forEach(element => {
//         hasEditVal.OrderItem.forEach(ele => {
//           if (element.id === ele.Item) {
//             element["inpRate"] = ele.Rate
//             element["inpQty"] = ele.Quantity
//             element["totalAmount"] = ele.Amount
//             element["UOM"] = ele.Unit
//             element["UOMLabel"] = ele.UnitName
//             element["inpBaseUnitQty"] = ele.BaseUnitQuantity

//           }
//         })
//       });
//     }
//     yield put(goButtonSuccess(response.Data));
//     yield put(SpinnerState(false))
//   } catch (error) {
//     yield put(SpinnerState(false))
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error Message",
//     }));
//   }
// }

// function* postOrder_GenFunc({ data }) {

//   yield put(SpinnerState(true))
//   try {
//     const response = yield call(OrderPage_Post_API, data);
//     yield put(postOrderSuccess(response));
//     yield put(SpinnerState(false))
//   } catch (error) {
//     yield put(SpinnerState(false))
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error Message",
//     }));
//   }
// }

// function* editOrderGenFunc({ id, pageMode }) {

//   yield put(SpinnerState(true))
//   try {
//     const response = yield call(editOrderID_forOrderPage_ApiCall, id);
//     response.pageMode = pageMode
//     yield put(SpinnerState(false))
//     debugger
//     yield put(editOrderIdSuccess(response));
//   } catch (error) {
//     yield put(SpinnerState(false))
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error Message",
//     }));
//   }
// }

// function* DeleteOrder_GenratorFunction({ id }) {
//   yield put(SpinnerState(true))
//   try {
//     const response = yield call(deleteOrderID_forOrderPage_ApiCall, id);
//     yield put(SpinnerState(false))
//     yield put(deleteOrderIdSuccess(response));
//   } catch (error) {
//     yield put(SpinnerState(false))
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error Message",
//     }));
//   }
// }

// function* UpdateOrder_ID_GenratorFunction({ data, id }) {

//   try {
//     yield put(SpinnerState(true))
//     const response = yield call(UpdateOrder_ID_ApiCall, data, id);
//     yield put(SpinnerState(false))
//     yield put(updateOrderIdSuccess(response))
//   }
//   catch (error) {
//     yield put(SpinnerState(false))
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error Message",
//     }));
//   }
// }

// List Page API
function* get_GRN_GerFunc() {

  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_get_API);
    yield put(SpinnerState(false))
    yield put(getGRNListPageSuccess(response.Data))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* GRNSaga() {

  // yield takeEvery(GO_BUTTON_FOR_ORDER_PAGE, goButtonGenFunc);
  // yield takeEvery(POST_ORDER_FROM_ORDER_PAGE, postOrder_GenFunc);
  // yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editOrderGenFunc);
  // yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenratorFunction)
  // yield takeEvery(DELETE_ORDER_FOR_ORDER_PAGE, DeleteOrder_GenratorFunction);
  yield takeEvery(GET_GRN_LIST_PAGE, get_GRN_GerFunc);
}

export default GRNSaga;
