import { call, delay, put, takeEvery } from "redux-saga/effects";

import {
  deleteOrderIdSuccess,
  postOrderSuccess,
  editOrderIdSuccess,
  updateOrderIdSuccess,
  getOrderListPageSuccess,
  goButtonForOrderAddSuccess,
} from "./actions";
import {
  OrderPage_Update_API,
  OrderPage_Delete_API,
  OrderPage_Post_API,
  OrderPage_GoButton_API,
  OrderList_get_Filter_API,
  OrderPage_Edit_API,
} from "../../../helpers/backend_helper";

import {
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE,
  POST_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE
} from "./actionType";

// import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { convertDatefunc, convertTimefunc, GoBtnDissable, mainSppinerOnOff, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* goButtonGenFunc({ data }) {


  // yield mainSppinerOnOff(true)
  yield delay(400)
  try {

    const response = yield call(OrderPage_GoButton_API, data);

    yield response.Data.OrderItems.forEach((ele, k) => {
      ele["id"] = k + 1
    });
    const termArr = []
    var term = response.Data.TermsAndConditions
    // if (term === undefined) { term = response.Data.TermsAndConditions }
    yield term.forEach((ele, k) => {
      termArr.push({
        value: ele.id,
        label: ele.TermsAndCondition,
        IsDeleted: 0
      })
    });
    yield response.Data.TermsAndConditions = termArr;

    yield put(goButtonForOrderAddSuccess(response.Data));
    // yield mainSppinerOnOff(false)
  } catch (error) {
    // yield mainSppinerOnOff(false)
    // yield put(AlertState({
    //   Type: 4,
    //   Status: true, Message: "500 Error Go Button-Order Page",
    // }));
  }






  // yield GoBtnDissable(true)
  // yield delay(400)
  // try {
  //   const response = yield call(OrderPage_GoButton_API, data);
  //   debugger
  //   if (hasEditVal) {
  //     yield response.Data.forEach(element => {
  //       hasEditVal.OrderItem.forEach(ele => {
  //         if (element.id === ele.Item) {
  //           element["Rate"] = ele.Rate
  //           element["Quantity"] = ele.Quantity
  //           element["Amount"] = ele.Amount
  //           element["Unit"] = ele.Unit
  //           element["UnitName"] = ele.UnitName
  //           element["BaseUnitQuantity"] = ele.BaseUnitQuantity
  //           // **======== update mode required  variables======********
  //           element["poRate"] = ele.Rate
  //           element["poQty"] = ele.Quantity
  //           element["poBaseUnitQty"] = ele.BaseUnitQuantity
  //           element["editrowId"] = ele.id
  //         }
  //       })
  //     });
  //   }

  //   yield response.Data.forEach(row => {

  //     if (row.poRate === undefined) { row["poRate"] = '' }
  //     if (row.poQty === undefined) { row["poQty"] = 0 }
  //     if (row.poBaseUnitQty === undefined) { row["poBaseUnitQty"] = '' }

  //     if (row["Rate"] === undefined) { row["Rate"] = '' }
  //     if (row["Quantity"] === undefined) { row["Quantity"] = '' }
  //     if (row["Amount"] === undefined) { row["Amount"] = 0 }
  //   });

  //   yield put(goButtonSuccess(response.Data));
  //   yield GoBtnDissable(false)
  // } catch (error) {
  //   yield GoBtnDissable(false)
  //   yield put(AlertState({
  //     Type: 4,
  //     Status: true, Message: "500 Error Go Button-Order Page",
  //   }));
  // }
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
function* get_OrderList_GenFunc({ filters }) {
  // yield mainSppinerOnOff(true)
  try {

    const response = yield call(OrderList_get_Filter_API, filters);

    // yield mainSppinerOnOff(false)

    // const response = yield CkeckAlert("post", url.ORDER_LiST_BY_FILTERS, s)

    const newList = yield response.Data.map((i) => {

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
    // yield mainSppinerOnOff(false)

  } catch (error) {
    // yield mainSppinerOnOff(false)
    // yield CkeckAlert("post", url.ORDER_LiST_BY_FILTERS, { StatusCode: 400 })
    // yield put(AlertState({
    //   Type: 4,
    //   Status: true, Message: "500 Error  Get OrderList",
    // }));
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

