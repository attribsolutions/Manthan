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
} from './actionType'



export const getSupplierAddress = () => ({
  type: GET_SUPPLIER_ADDRESS,
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


export const GetVenderSupplierCustomer = (subPageMode) => ({
  type: GET_VENDER_SUPPLIER_CUSTOMER,
  subPageMode,
});

export const GetVenderSupplierCustomerSuccess = orders => ({
  type: GET_VENDER_SUPPLIER_CUSTOMER_SUCCESS,
  payload: orders,
})
