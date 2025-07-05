import { call, put, takeLatest } from "redux-saga/effects";
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
  postOrderConfirms_API_Success,
  orderSinglegetSuccess,
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
  OrderPage_Edit_ForDownload_API,
  InterBranch_Order_Delete_API,
  IB_Order_Update_API,
  IB_Order_Get_Api,
  order_Single_and_Multiple_Print_API,
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
  POST_ORDER_CONFIRM_API,
  ORDER_SINGLE_GET_API
} from "./actionType";
import { amountCommaSeparateFunc, listpageConcatDateAndTime, date_dmy_func, loginSystemSetting, IsSweetAndSnacksCompany, loginCompanyID, loginUserIsFranchisesRole, convertTimefunc } from "../../../components/Common/CommonFunction";
import *as url from "../../../routes/route_url"



const CheckRateFromCompany = () => {
  const checkRateFromCompany = loginSystemSetting().MRP_Rate
  const loginCompanyId = IsSweetAndSnacksCompany() ? loginCompanyID() : "";
  const result = checkRateFromCompany
    .split(',')
    .map((part) => part.split('-')[0])
    .join(',');
  const isRateForSweetAndSnacksCompany = result.split(',').includes(loginCompanyId.toString());
  return { result, isRateForSweetAndSnacksCompany };
};




function* goButtonGenFunc({ config }) {                     // GO-Botton order Add Page by subPageMode  

  try {

    const { subPageMode, } = config
    let response;
    if ((subPageMode === url.ORDER_1) || (subPageMode === url.ORDER_2) || (subPageMode === url.ORDER_4) || (subPageMode === url.IB_ORDER) || (subPageMode === url.IB_SALES_ORDER) || (subPageMode === url.ORDER_QUATATION)) {
      response = yield call(OrderPage_GoButton_API, config); // GO-Botton Purchase Order 1 && 2 Add Page API
      yield response.Data.OrderItems.forEach((ele, k) => {
        ele["id"] = k + 1
        ele.UnitDetails = ele.UnitDetails.map(unit => ({
          ...unit,
          _BaseUnitRate: (unit.Rate * unit.BaseUnitQuantity)  /// this field add only for testing purpose ///checking  not use any where in code only for observation
        }))
        const isRateForSweetAndSnacksCompany = CheckRateFromCompany().isRateForSweetAndSnacksCompany;

        if ((subPageMode === url.ORDER_4) && loginUserIsFranchisesRole()) {
          ele.Rate = Number(ele.MRPValue)
          ele.UnitDetails = ele.UnitDetails.map(unit => ({
            ...unit, Rate: Number(ele.MRPValue),
          }))
        }

        if ((subPageMode === url.ORDER_1) || (subPageMode === url.IB_ORDER) || isRateForSweetAndSnacksCompany) {
          ele.Rate = Number(ele.VRate)
          ele.UnitDetails = ele.UnitDetails.map(unit => ({
            ...unit, Rate: Number(ele.VRate),
          }))
        }
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
    // else if (subPageMode === url.IB_ORDER) {

    //   response = yield call(IBOrderPage_GoButton_API, config); // GO-Botton IB-invoice Add Page API

    //   yield response.Data.OrderItems.forEach((ele, k) => {
    //     ele["id"] = k + 1;
    //     ele.Rate = Number(ele.Rate);
    //     ele.UnitDetails = ele.UnitDetails.map(unit => ({ ...unit, Rate: Number(ele.Rate) }));
    //   });
    // }

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
    if (subPageMode === url.IB_ORDER || subPageMode === url.IB_SALES_ORDER) {                   // Save  Order  Add Page by subPageMode 
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

  const { btnmode, btnId, subPageMode } = config;
  try {
    const isRateForSweetAndSnacksCompany = CheckRateFromCompany().isRateForSweetAndSnacksCompany;
    let response = yield call(OrderPage_Edit_Post_API, config);
    if ((subPageMode === url.ORDER_LIST_1) || (subPageMode === url.IB_ORDER_PO_LIST) || isRateForSweetAndSnacksCompany) {
      response.Data.OrderItems.forEach((ele, k) => {
        ele.Rate = Number(ele.VRate)
        ele.UnitDetails = ele.UnitDetails.map(unit => ({
          ...unit, Rate: Number(ele.VRate),
        }))
      })
    }

    response.pageMode = btnmode
    response.btnId = btnId
    yield put(editOrderIdSuccess(response));
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* DeleteOrder_GenFunc({ config }) {
  // Delete Order by subPageMode
  try {
    let response = ""
    if (config.subPageMode === url.IB_ORDER_PO_LIST || config.subPageMode === url.IB_ORDER_SO_LIST) {
      response = yield call(InterBranch_Order_Delete_API, config);
    } else {
      response = yield call(OrderPage_Delete_API, config);
    }


    yield put(deleteOrderIdSuccess(response));
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* UpdateOrder_ID_GenFunc({ config }) {         // Update Order by subPageMode

  try {
    let response = ""
    if (config.subPageMode === url.IB_ORDER) {
      response = yield call(IB_Order_Update_API, config);
    } else {
      response = yield call(OrderPage_Update_API, config);
    }

    yield put(updateOrderIdSuccess(response))
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}


function* orderList_GoBtn_GenFunc({ config }) {




  //  Order List Filter by subPageMode
  const isSweetAndSnacksCompany = IsSweetAndSnacksCompany()


  try {
    const hasRole = (role) => config?.userAccess[role];
    const { subPageMode } = config
    let response;
    let newList;

    if ((subPageMode === url.ORDER_LIST_1) || (subPageMode === url.ORDER_LIST_2) || (subPageMode === url.ORDER_LIST_4) || (subPageMode === url.APP_ORDER_LIST)) {
      response = yield call(OrderList_get_Filter_API, config); // GO-Botton Purchase Order 1 && 2 Add Page API
    }
    else if ((subPageMode === url.GRN_STP_1) || subPageMode === url.GRN_STP_3) {

      response = yield call(GRN_STP_for_orderList_goBtn, config); // GO-Botton IB-invoice Add Page API

    }
    else if ((subPageMode === url.IB_ORDER_PO_LIST) || (subPageMode === url.IB_ORDER_SO_LIST) || (subPageMode === url.IB_INVOICE_STP)) {
      response = yield call(IBOrderList_get_Filter_API, config); // GO-Botton IB-invoice Add Page API
    }

    newList = yield response.Data.map((i) => {

      i["recordsAmountTotal"] = i.OrderAmount;  // Breadcrumb Count total
      i.OrderAmount = amountCommaSeparateFunc(i.OrderAmount) //  GrandTotal show with commas
      var DeliveryDate = date_dmy_func(i.DeliveryDate);

      i.dashboardOrderDate = date_dmy_func(i.OrderDate); // Only for Dashoard 
      // //tranzaction date is only for fiterand page field but UI show transactionDateLabel


      const DateAndTimeLable = listpageConcatDateAndTime(i.OrderDate, i.CreatedOn);
      i["transactionDate"] = `${i.CreatedOn}${DateAndTimeLable}`; // transactionDate for sorting and filtering data 
      i["transactionDateLabel"] = DateAndTimeLable;


      i.DeliveryDate = (`${DeliveryDate}`)

      i.forceEditHide = false;
      i.forceMakeBtnHide = true;
      i.forceDeleteHide = false;
      i.forceSelectDissabled = false;
      i.forceHideOrderAprovalBtn = true;
      i.ExtraSelect = false

      debugger
      if (i.Inward > 0) {

        i.Inward = "Close"
        i.Status = "Close"
        i.forceEditHide = true

      } else {
        i.Status = "Open";
        i.Inward = "Open";
        if ((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany)) {
          i.forceExtraSelectDissabled = true;
        }
        if (subPageMode === url.GRN_STP_1 || (subPageMode === url.ORDER_LIST_1) || (subPageMode === url.IB_ORDER_SO_LIST) || (subPageMode === url.GRN_STP_3) || (subPageMode === url.IB_ORDER_PO_LIST)) {
          if ((subPageMode === url.IB_ORDER_SO_LIST || subPageMode === url.IB_ORDER_PO_LIST) && i.InvoiceCreated) {
            i.forceEditHide = true;
            i.forceMakeBtnHide = true
            i.forceDeleteHide = true;
          } else {
            i.forceMakeBtnHide = false
          }
        }
      }

      //+++++++++++++++++++++++++  Status colonm show Status   ++++++++++++++++++++++++++++++++++++++
      // if (i.SAPResponse) {
      //   i.SAPStatus = "Order send To SAP"
      // }

      // if (i.InvoiceCreated === true) {
      //   i.Status = "Invoice Created"
      //   if ((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany)) {
      //     i.forceMakeBtnHide = false

      //     i.forceExtraSelectDissabled = true;
      //   }
      // }
      // else if (i.IsConfirm === true) {
      //   i.Status = "Order Confirm"
      //   if ((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany)) {
      //     i.forceExtraSelectDissabled = false;;
      //   }


      // }


      //+++++++++++++++++++++++++  Status colonm show Status   ++++++++++++++++++++++++++++++++++++++
      if (i.SAPResponse) {
        i.SAPStatus = "Order send To SAP"
      }

      if (i.InvoiceDeleted === true) {                     //  New Flag Logic
        i.Status = "Invoice Deleted";
      } else if (i.InvoiceCreated === true) {
        i.Status = "Invoice Created"
        if ((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany)) {
          i.forceMakeBtnHide = false
          i.forceExtraSelectDissabled = true;
        }
      }
      else if (i.IsConfirm === true) {
        i.Status = "Order Confirm"
        if ((subPageMode === url.ORDER_LIST_4) && (isSweetAndSnacksCompany)) {
          i.forceExtraSelectDissabled = false;
        }
      }



      //**********************************order Aproval button Show Condition ********************************************************** */

      if (!i.SAPResponse && i.CustomerSAPCode) {//order Aproval button Show Condition 

        // i.forceHideOrderAprovalBtn = false;

        if (i.SupplierSAPCode) {             //if   SupplierSAPCode not there then user not allow to 
          i.forceHideOrderAprovalBtn = false;
        } else {
          i.forceHideOrderAprovalBtn = true;
        }

        if (hasRole("RoleAccess_SendToSAP")) {  //if RoleAccess_SendToSAP then only all select aplicable access not then not aplical

          i.forceSelectDissabled = true;
        } else {
          i.forceSelectDissabled = false;
        }
      }



      //++++++++++++++++++++++++++++++++++++++ make invoice Button dessiable/vissbble ++++++++++++++++++++++++++++++++++++++
      if (!(i.InvoiceCreated === true) && (i.IsConfirm === true)) {
        i.forceMakeBtnHide = false
      }

      //**********************************order Aproval button Show Condition ********************************************************** */

      if (i.IsConfirm === true) {// is confirm is true the show force delete and edit true "PO" ans "SO" mode 
        i.forceEditHide = true;
        i.forceDeleteHide = true;
        i.forceSelectDissabled = true;
        if (subPageMode === url.APP_ORDER_LIST) {

          if (!(i.SubPartyFlag) || (i.InvoiceCreated)) {
            i.forceSelectDissabled = true;//select row check box dessible 
            if (i.InvoiceCreated) {
              i.forceSelectDissabled = true;//select row check box dessible 
            }
          } else {
            i.forceSelectDissabled = false
          }
        }
      }

      //**********sap_code order page********************************************************************************************
      if (i.SAPResponse) {  //If sapcode true the edit and delete btn  dissbale

        var numb = i.SAPResponse.match(/\d/g);
        i.SAPResponse = numb.join("");
        i.FullOrderNumber = `${i.FullOrderNumber} (${i.SAPResponse})`//concate sap code and full order number
        i.forceEditHide = true
        i.forceDeleteHide = true
      }


      if (loginUserIsFranchisesRole() && i.Status === "Open") {
        i.forceMakeBtnHide = false

      }

      return i
    })
    if (subPageMode === url.ORDER_LIST_4) {
      newList = newList.filter(i => i.MobileAppOrderFlag === null);
    } else if (subPageMode === url.APP_ORDER_LIST) {
      newList = newList.filter(i => i.MobileAppOrderFlag !== null);
    }
    else if (subPageMode === url.GRN_STP_1) {
      newList = newList.filter(i => i.Status === "Open");
    }
    else if (subPageMode === url.ORDER_LIST_1) {
      newList.forEach(order => {
        if (order.Status === "Close") {
          order.forceDeleteHide = true;
        }
      });

    } else if (subPageMode === url.GRN_STP_3) {
      newList = newList.filter(i => i.Inward !== "Close");
    }
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
    let response = yield call(OrderConfirm_post_API, config);
    response["conform_saveInvoice"] = config.conform_saveInvoice
    yield put(postOrderConfirms_API_Success(response))
  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* OrderSingleGet_GenFunc({ config }) {

  try {
    let response = ""
    if (config.subPageMode === url.IB_ORDER_SO_LIST || config.subPageMode === url.IB_ORDER_PO_LIST) {
      response = yield call(IB_Order_Get_Api, config);
    } else {
      response = yield call(order_Single_and_Multiple_Print_API, config);

    }

    yield put(orderSinglegetSuccess(response))

  } catch (error) {
    yield put(orderApiErrorAction())
  }
}

function* OrderPageSaga() {
  yield takeLatest(GO_BUTTON_FOR_ORDER_PAGE, goButtonGenFunc);
  yield takeLatest(SAVE_ORDER_FROM_ORDER_PAGE, saveOrder_GenFunc);
  yield takeLatest(EDIT_ORDER_FOR_ORDER_PAGE, editOrderGenFunc);
  yield takeLatest(UPDATE_ORDER_ID_FROM_ORDER_PAGE, UpdateOrder_ID_GenFunc)
  yield takeLatest(DELETE_ORDER_FOR_ORDER_PAGE, DeleteOrder_GenFunc);
  yield takeLatest(GET_ORDER_LIST_PAGE, orderList_GoBtn_GenFunc);
  yield takeLatest(ORDER_APPROVAL_ACTION, orderApproval_GenFunc);
  yield takeLatest(GET_ORDER_APPROVAL_DETAIL, getOrderApproval_Detail_GenFunc);
  yield takeLatest(POST_ORDER_CONFIRM_API, OrderConfirm_GenFunc);

  yield takeLatest(ORDER_SINGLE_GET_API, OrderSingleGet_GenFunc);

}

export default OrderPageSaga;

