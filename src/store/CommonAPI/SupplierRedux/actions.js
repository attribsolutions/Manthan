import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER,
  GET_SUPPLIER_ADDRESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
  GET_ORDER_TYPE,
  GET_ORDER_TYPE_SUCCESS,
  GET_VENDER,
  GET_VENDER_SUCCESS,
  GET_CUSTOMER,
  GET_CUSTOMER_SUCCESS,
  GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS,
  GET_VENDER_SUPPLIER_CUSTOMER,
  SSDD_LIST_UNDER_COMPANY,
  SSDD_LIST_UNDER_COMPANY_SUCCESS,
  RETAILER_LIST,
  RETAILER_LIST_SUCCESS,
  PARTY_DROPDOWN_LIST,
  PARTY_DROPDOWN_LIST_SUCCESS,
} from './actionType'



export const getSupplierAddress = (editId) => ({
  type: GET_SUPPLIER_ADDRESS,
  editId,
});

export const getSupplierAddressSuccess = address => ({
  type: GET_SUPPLIER_ADDRESS_SUCCESS,
  payload: address,
})
// ************************************************************


export const getSupplier = () => ({
  type: GET_SUPPLIER,
});

export const getSupplierSuccess = orders => ({
  type: GET_SUPPLIER_SUCCESS,
  payload: orders,
})
// ************************************************************

export const GetVender = () => ({
  type: GET_VENDER,
});

export const GetVenderSuccess = orders => ({
  type: GET_VENDER_SUCCESS,
  payload: orders,
})
// ************************************************************

export const GetCustomer = () => ({
  type: GET_CUSTOMER,
});

export const GetCustomerSuccess = orders => ({
  type: GET_CUSTOMER_SUCCESS,
  payload: orders,
})


// ************************************************************
export const getOrderType = () => ({
  type: GET_ORDER_TYPE,
});

export const getOrderTypeSuccess = orderType => ({
  type: GET_ORDER_TYPE_SUCCESS,
  payload: orderType,
})


export const GetVenderSupplierCustomer = (data) => ({
  type: GET_VENDER_SUPPLIER_CUSTOMER,
  data
});

export const GetVenderSupplierCustomerSuccess = orders => ({
  type: GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS,
  payload: orders,
})

// All SS/DD under given Company
export const SSDD_List_under_Company = () => ({
  type: SSDD_LIST_UNDER_COMPANY,
});

export const SSDD_List_under_Company_Success = resp => ({
  type: SSDD_LIST_UNDER_COMPANY_SUCCESS,
  payload: resp,
})

// All Retailer under given Party and Company
export const Retailer_List = (data) => ({
  type: RETAILER_LIST,
  data
});

export const Retailer_List_Success = resp => ({
  type: RETAILER_LIST_SUCCESS,
  payload: resp,
})

// Party Dropdown List API For all Pages used
export const Party_Dropdown_List = (loginEmployeeID) => ({
  type: PARTY_DROPDOWN_LIST,
  loginEmployeeID
});

export const Party_Dropdown_List_Success = resp => ({
  type: PARTY_DROPDOWN_LIST_SUCCESS,
  payload: resp,
})
