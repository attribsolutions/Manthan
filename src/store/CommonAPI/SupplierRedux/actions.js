import {
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER,
  GET_SUPPLIER_ADDRESS,
  GET_SUPPLIER_ADDRESS_SUCCESS,
  GET_ORDER_TYPE,
  GET_ORDER_TYPE_SUCCESS,
} from './actionType'


export const getSupplier = () => ({
  type: GET_SUPPLIER,
});

export const getSupplierSuccess = orders => ({
  type: GET_SUPPLIER_SUCCESS,
  payload: orders,
})

export const getSupplierAddress = () => ({
  type: GET_SUPPLIER_ADDRESS,
});

export const getSupplierAddressSuccess = address => ({
  type: GET_SUPPLIER_ADDRESS_SUCCESS,
  payload: address,
})

export const getOrderType = () => ({
  type: GET_ORDER_TYPE,
});

export const getOrderTypeSuccess = orderType => ({
  type: GET_ORDER_TYPE_SUCCESS,
  payload: orderType,
})
