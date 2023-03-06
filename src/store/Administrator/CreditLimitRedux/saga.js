import { call, delay, put, takeEvery } from "redux-saga/effects";
import {
    postCreditLimitSuccess,
    //   editOrderIdSuccess,
    //   updateOrderIdSuccess,
    //   getOrderListPageSuccess,
    GoButton_For_CreditLimit_AddSuccess,
} from "./actions";
import {
    //   OrderPage_Update_API,
    //   OrderPage_Delete_API,
    CreditLimit_GoButton_Post_API,
    Post_CreditLimit_Master_API,
    //   OrderList_get_Filter_API,
    //   OrderPage_Edit_API,
    //   IBOrderPage_GoButton_API,
    //   IBOrderList_get_Filter_API,
    //   GRN_STP_for_orderList_goBtn,
    //   IBOrderPage_Save_API,
} from "../../../helpers/backend_helper";
import {
    //   UPDATE_ORDER_ID_FROM_ORDER_PAGE,
    //   EDIT_ORDER_FOR_ORDER_PAGE,
    //   DELETE_ORDER_FOR_ORDER_PAGE,
    GO_BUTTON_FOR_CREDITLIMIT_PAGE,
    POST_CREDITLIMIT_PAGE,
    //   GET_ORDER_LIST_PAGE
} from "./actionTypes";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { CommonConsole, concatDateAndTime, convertDatefunc, convertTimefunc, GoBtnDissable, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import *as url from "../../../routes/route_url"


function* GoButton_CreditLimit_post_genfun({ jsonbody, btnId }) {
  
    // yield put(SpinnerState(true))
    try {
  
      const response = yield call(CreditLimit_GoButton_Post_API, jsonbody);
      // GoBtnDissable({ id: btnId, state: false })
  
      yield put(GoButton_For_CreditLimit_AddSuccess(response.Data));
  
    } catch (error) {
      GoBtnDissable({ id: btnId, state: false })
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Message Go Button in Work Order ",
      }));
    }
  }

  // Credit Limit Post API
  function* Post_CreditLimit_GenratorFunction({ jsonbody, btnId }) {
  
    // yield put(SpinnerState(true))
    try {
      const response = yield call(Post_CreditLimit_Master_API, jsonbody);
      //
      yield put(postCreditLimitSuccess(response));
    } catch (error) {
      //
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Message post error in Work Order",
      }));
    }
  }
// function* editOrderGenFunc({ jsonBody, pageMode }) {     //  Edit Order by subPageMode
//   try {
//     const response = yield call(OrderPage_Edit_API, jsonBody);
//     response.pageMode = pageMode
//     yield put(editOrderIdSuccess(response));
//   } catch (error) { CommonConsole(error) }
// }

// function* UpdateOrder_ID_GenFunc({ data, id }) {         // Update Order by subPageMode
//   try {
//     yield saveDissable(true)
//     const response = yield call(OrderPage_Update_API, data, id);
//     yield put(updateOrderIdSuccess(response))
//     yield saveDissable(false)
//   }
//   catch (error) {
//     yield saveDissable(false)
//     yield put(AlertState({
//       Type: 4,
//       Status: true, Message: "500 Error UpdateOrder",
//     }));
//   }
// }

// function* orderList_GoBtn_GenFunc(action) {              //  Order List Filter by subPageMode
//   try {

//     const { subPageMode, pageMode, jsonBody } = action
//     let response;
//     let newList;
//     if ((subPageMode === url.ORDER_LIST_1) || (subPageMode === url.ORDER_LIST_2)) {
//       response = yield call(OrderList_get_Filter_API, jsonBody); // GO-Botton Purchase Order 1 && 2 Add Page API
//     }
//     else if (subPageMode === url.GRN_STP) {
//       response = yield call(GRN_STP_for_orderList_goBtn, jsonBody); // GO-Botton IB-invoice Add Page API
//     }
//     else if ((subPageMode === url.IB_ORDER_PO_LIST) ||(subPageMode === url.IB_ORDER_SO_LIST) || (subPageMode === url.IB_INVOICE_STP)) {
//       response = yield call(IBOrderList_get_Filter_API, jsonBody); // GO-Botton IB-invoice Add Page API
//     }
//     else if ((subPageMode === url.ORDER_LIST_4)) {
//       response = yield call(IBOrderList_get_Filter_API, jsonBody); // GO-Botton IB-invoice Add Page API
//     }
//     newList = yield response.Data.map((i) => {

//       i["preOrderDate"] = i.OrderDate
//       var DeliveryDate = convertDatefunc(i.DeliveryDate);
//       i.OrderDate = concatDateAndTime(i.OrderDate, i.CreatedOn)
//       i.DeliveryDate = (`${DeliveryDate}`)

//       if ((i.Inward === 0)) {
//         i.Inward = "Open"
//         i.forceEdit = false
//       } else {
//         i.Inward = "Close"
//         i.forceEdit = true
//       }
//       return i
//     })
//     yield put(getOrderListPageSuccess(newList))

//   } catch (error) { CommonConsole(error) }
// }

function* CreditLimitSaga() {
    yield takeEvery(GO_BUTTON_FOR_CREDITLIMIT_PAGE, GoButton_CreditLimit_post_genfun);
    yield takeEvery(POST_CREDITLIMIT_PAGE, Post_CreditLimit_GenratorFunction);
    //   yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editOrderGenFunc);
    //   yield takeEvery(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenFunc)
    //   yield takeEvery(GET_ORDER_LIST_PAGE, orderList_GoBtn_GenFunc);
}

export default CreditLimitSaga;

