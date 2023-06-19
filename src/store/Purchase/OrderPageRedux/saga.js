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
  orderApiErrorAction,
  getDivisionOrdersSuccess,
  postOrderConfirms_API_Success,
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
  OrderConfirm_post_API,
} from "../../../helpers/backend_helper";
import {
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE,
  SAVE_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE,
  ORDER_APPROVAL_ACTION,
  GET_ORDER_APPROVAL_DETAIL,
  POST_ORDER_CONFIRM_API
} from "./actionType";
import { concatDateAndTime, date_dmy_func, } from "../../../components/Common/CommonFunction";
import *as url from "../../../routes/route_url"
import { customAlert } from "../../../CustomAlert/ConfirmDialog";


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
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* saveOrder_GenFunc({ config }) {

  const { subPageMode, btnId, jsonBody, gotoInvoiceMode } = config;

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
      response["btnId"] = btnId
      response["gotoInvoiceMode"] = gotoInvoiceMode
    }
    yield put(saveOrderActionSuccess(response));
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* editOrderGenFunc({ config }) {     //  Edit Order by subPageMode

  const { btnmode, btnId } = config;
  try {
    let response = yield call(OrderPage_Edit_Post_API, config);
    response.pageMode = btnmode
    response.btnId = btnId
    yield put(editOrderIdSuccess(response));
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* DeleteOrder_GenFunc({ config }) {                  // Delete Order by subPageMode
  try {

    const response = yield call(OrderPage_Delete_API, config);
    yield put(deleteOrderIdSuccess(response));
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* UpdateOrder_ID_GenFunc({ config }) {         // Update Order by subPageMode
  try {
    const response = yield call(OrderPage_Update_API, config);
    yield put(updateOrderIdSuccess(response))
  } catch (error) {
    yield put(orderApiErrorAction())
  }

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

      i.forceEditHide = false;
      i.forceMakeBtn = true;
      i.forceDeleteHide = false;
      i.forceSelectDissabled = false;
      i.forceHideOrderAprovalBtn = true;
      i.Status = "Open";
      i.Inward = "Open";


      if (i.Inward > 0) {
        i.Inward = "Close"
        i.Status = "Close"
        i.forceEditHide = true
      }

      //+++++++++++++++++++++++++  Status colonm show Status    ++++++++++++++++++++++++++++++++++++++
      if (i.SAPResponse) {
        i.Status = "Order send To SAP"
      }
      else if (i.InvoiceCreated === true) {
        i.Status = "Invoice Created"
      }
      else if (i.IsConfirm === true) {
        i.Status = "Order Confirm"
        i.forceMakeBtn = false
      }

      //**********************************order Aproval button Show Condition ********************************************************** */
      if (!i.SAPResponse && i.CustomerSAPCode) {//order Aproval button Show Condition 
        i.forceHideOrderAprovalBtn = false;
      }

      //++++++++++++++++++++++++++++++++++++++ make invoice Button dessiable/vissbble ++++++++++++++++++++++++++++++++++++++
      if (i.InvoiceCreated === true) {
        i.forceMakeBtn = true
      }

      //**********************************order Aproval button Show Condition ********************************************************** */
      if (i.IsConfirm === true) {// is confirm is true the show force delete and edit true "PO" ans "SO" mode 
        i.forceEditHide = true;
        i.forceDeleteHide = true;
        i.forceSelectDissabled = true;//select row check box dessible 
      }

      //**********sap_code order page********************************************************************************************
      if (i.SAPResponse) {  //If sapcode true the edit and delete btn  dissbale

        var numb = i.SAPResponse.match(/\d/g);
        i.SAPResponse = numb.join("");
        i.FullOrderNumber = `${i.FullOrderNumber} (${i.SAPResponse})`//concate sap code and full order number
        i.forceEditHide = true
        i.forceDeleteHide = true
      }

      return i
    })
    yield put(getOrderListPageSuccess(newList))

  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* orderApproval_GenFunc({ config }) {
  try {
    const response = yield call(orderApproval_Save_API, config)
    yield put(orderApprovalActionSuccess(response));
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* getOrderApproval_Detail_GenFunc({ config }) {

  try {

    const response = yield call(OrderPage_Edit_Get_API, config)
    response.btnId = config.btnId
  
    yield put(getOrderApprovalDetailActionSucc(response));
   
  } catch (error) {
    yield put(getOrderApprovalDetailActionSucc({ Status: false }))
    yield put(orderApprovalActionSuccess({
      Status: true,
      Message: "Order Save Successfully But Can't Send in 'SAP'"
    }))
    yield put(orderApiErrorAction())
  }
}

function* OrderConfirm_GenFunc({ config }) {         // Update Order by subPageMode
  try {
    const response = yield call(OrderConfirm_post_API, config);
    yield put(postOrderConfirms_API_Success(response))
  } catch (error) {
    yield put(orderApiErrorAction())
  }
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
  yield takeEvery(POST_ORDER_CONFIRM_API, OrderConfirm_GenFunc);

}

export default OrderPageSaga;

