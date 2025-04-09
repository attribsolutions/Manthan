import { call, put, takeLatest } from "redux-saga/effects";
import {
  EmployeeSubEmployee_List_Success,
  GetCustomerSuccess,
  getOrderTypeSuccess,
  getSupplierAddressSuccess,
  getSupplierSuccess,
  GetVenderSuccess,
  GetVenderSupplierCustomerSuccess,
  Party_Dropdown_List_Success,
  Partyonclustersubcluste_List_Success,
  Retailer_List_Success,
  SSDD_List_under_Company_Success,
} from "./actions";
import {
  get_OrderType_Api,
  Party_Dropdown_Get_API,
  Party_Master_Edit_API,
  PartyOnClusterSbcluster_Dropdown_Get_API,
  Retailer_List_under_Company_PartyAPI,
  SSDD_List_under_Company_API,
  SubEmployee_Dropdown_Get_API,
  VendorSupplierCustomer,
} from "../../../helpers/backend_helper";

import {
  GET_CUSTOMER,
  GET_ORDER_TYPE,
  GET_SUPPLIER,
  GET_SUPPLIER_ADDRESS,
  GET_VENDER,
  GET_VENDER_SUPPLIER_CUSTOMER,
  PARTY_DROPDOWN_LIST,
  PARTY_ON_CLUSTER_SUBCLUSTER_LIST,
  RETAILER_LIST,
  SSDD_LIST_UNDER_COMPANY,
  SUB_EMPLOYEE_LIST,
} from "./actionType";

import { CommonConsole, IsAuthorisedURL, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";
import { commonApiReducer_ErrorAction } from "../../actions";

function* supplierAddressGenFunc({ editId }) {
  const config = { editId: editId }
  try {
    const response = yield call(Party_Master_Edit_API, config);
    let first = [], secd = [], newArr = []
    const arr = response.Data.Data.PartyAddress;
    arr.forEach((i, k) => {
      if (i.IsDefault === true) {

        first.push({
          value: i.id,
          label: i.Address,
        })
      } else {
        secd.push({
          value: i.id,
          label: i.Address,
        })
      }
    })
    newArr = [...first, ...secd]

    yield put(getSupplierAddressSuccess(newArr));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

// OrderType Dropdown
function* OrderType_GenFunc() {
  try {
    const response = yield call(get_OrderType_Api);
    yield put(getOrderTypeSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* getVendorGenFunc({ jsonBody = '' }) {

  const { PartyID = loginPartyID(), Type = 1 } = jsonBody
  try {
    const response = yield call(VendorSupplierCustomer, { "Type": Type, "PartyID": PartyID, "Company": loginCompanyID(), Route: "" });
    yield put(GetVenderSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* getSupplierGenFunc({ jsonBody = '' }) {

  const { PartyID = loginPartyID() } = jsonBody
  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 2, "PartyID": PartyID, "Company": loginCompanyID(), Route: "" });
    yield put(getSupplierSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* getCustomerGenFunc() {
  try {
    const response = yield call(VendorSupplierCustomer, { "Type": 3, "PartyID": loginPartyID(), "Company": loginCompanyID(), Route: "" });
    yield put(GetCustomerSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* vendorSupplierCustomer_genFunc({ data }) {

  const {
    subPageMode,
    RouteID = "",
    PartyID = loginPartyID(),
    Company = loginCompanyID() } = data

  let response;
  debugger
  const isVender = (subPageMode === url.ORDER_1 //vendor mode 1
    || subPageMode === url.ORDER_LIST_1
    || subPageMode === url.GRN_STP_1);

  const isSuppiler = (subPageMode === url.ORDER_2 //supplier mode 2
    || subPageMode === url.ORDER_LIST_2
    || subPageMode === url.GRN_STP_3
    || subPageMode === url.GRN_LIST_3
    || subPageMode === url.PURCHASE_RETURN_LIST
    || subPageMode === url.PURCHASE_RETURN
    || subPageMode === url.PURCHASE_RETURN_MODE_3
    || subPageMode === url.SELF_LEDGER
    || subPageMode === url.PARTY_DETAILS
    || subPageMode === url.ORDER_QUATATION
    || subPageMode === url.ORDER_QUATATION_LIST
  )

    ;

  const isCustomer = (subPageMode === url.ORDER_4  //Customer mode 3
    || subPageMode === url.ORDER_LIST_4
    || subPageMode === url.APP_ORDER_LIST
    || subPageMode === url.ITEM_SALE_REPORT
    || subPageMode === url.INVOICE_1
    || subPageMode === url.INVOICE_LIST_1
    || subPageMode === url.PARTY_LEDGER
    || subPageMode === url.GST_R1_REPORT
    || subPageMode === url.MOBILE_RETAILER_SEND
    || subPageMode === url.POS_INVOICE_LIST

  );


  const isDivisions = (subPageMode === url.IB_ORDER //divisions mode 4
    || subPageMode === url.IB_ORDER_PO_LIST
    || subPageMode === url.INWARD
    || subPageMode === url.IB_INVOICE
    || subPageMode === url.IB_INVOICE_LIST
    || subPageMode === url.INWARD_LIST
    || subPageMode === url.IB_SALES_ORDER
    || subPageMode === url.IB_INVOICE_FOR_GRN
  );



  const jsonBody = {
    "PartyID": PartyID,
    "Company": Company,
    "Route": RouteID
  }

  try {
    if (isVender) {
      response = yield call(VendorSupplierCustomer, JSON.stringify({ ...jsonBody, "Type": 1, }));//vendor mode 1
    }
    else if (isSuppiler) {
      response = yield call(VendorSupplierCustomer, JSON.stringify({ ...jsonBody, "Type": 2, }));//supplier mode 2
    }
    else if (isCustomer) {
      response = yield call(VendorSupplierCustomer, JSON.stringify({ ...jsonBody, "Type": 3, }));//Customer mode 3
    }
    else if (isDivisions) {
      response = yield call(VendorSupplierCustomer, JSON.stringify({ ...jsonBody, "Type": 4, }));//divisions mode 4
    } else {
      response = { Data: [] }
    }
    response.Data.map((index) => {
      index["selectCheck"] = false
      return index
    });

    yield put(GetVenderSupplierCustomerSuccess(response.Data));
  }
  catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* SSDD_List_under_Company_GenFunc() {
  try {
    const response = yield call(SSDD_List_under_Company_API, { "Type": 3, "PartyID": loginPartyID(), "CompanyID": loginCompanyID() });
    yield put(SSDD_List_under_Company_Success(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* Retailer_List_GenFunc({ data }) {

  try {
    const response = yield call(Retailer_List_under_Company_PartyAPI, data);
    yield put(Retailer_List_Success(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* Party_Dropdown_List_GenFunc({ loginEmployeeID }) {

  try {
    const response = yield call(Party_Dropdown_Get_API, loginEmployeeID);
    yield put(Party_Dropdown_List_Success(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}

function* SubEmployee_Dropdown_List_GenFunc({ loginEmployeeID }) {

  try {
    const response = yield call(SubEmployee_Dropdown_Get_API, loginEmployeeID);
    yield put(EmployeeSubEmployee_List_Success(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}



function* PartyonClusterSubcluster_Dropdown_List_GenFunc({ config }) {
  try {
    const response = yield call(PartyOnClusterSbcluster_Dropdown_Get_API, config);
    yield put(Partyonclustersubcluste_List_Success(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(commonApiReducer_ErrorAction());
  }
}



function* SupplierSaga() {
  yield takeLatest(GET_SUPPLIER, getSupplierGenFunc);
  yield takeLatest(GET_SUPPLIER_ADDRESS, supplierAddressGenFunc);
  yield takeLatest(GET_ORDER_TYPE, OrderType_GenFunc);
  yield takeLatest(GET_VENDER, getVendorGenFunc);
  yield takeLatest(GET_VENDER_SUPPLIER_CUSTOMER, vendorSupplierCustomer_genFunc);
  yield takeLatest(GET_CUSTOMER, getCustomerGenFunc);
  yield takeLatest(SSDD_LIST_UNDER_COMPANY, SSDD_List_under_Company_GenFunc);
  yield takeLatest(RETAILER_LIST, Retailer_List_GenFunc);
  yield takeLatest(PARTY_DROPDOWN_LIST, Party_Dropdown_List_GenFunc);
  yield takeLatest(SUB_EMPLOYEE_LIST, SubEmployee_Dropdown_List_GenFunc);
  yield takeLatest(PARTY_ON_CLUSTER_SUBCLUSTER_LIST, PartyonClusterSubcluster_Dropdown_List_GenFunc);





}

export default SupplierSaga;
