import {

  GET_DIVISIONORDER_LIST,
  GET_DIVISIONORDER_LIST_SUCCESS,
  GET_ORDER_LIST,
  GET_ORDER_LIST_MESSAGE,
  GET_ORDER_LIST_SUCCESS,
  GET_ORDER_ITEMS_FOR_ORDER_PAGE,
  GET_ORDER_ITEMS_FOR_ORDER_PAGE_SUCCESS,
  SUBMIT_ORDER_FROM_ORDER_PAGE,
  SUBMIT_ORDER_FROM_ORDER_PAGE_SUCCESS,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS
} from './actionType'

export const getOrderItems_ForOrderPage = () => ({
  type: GET_ORDER_ITEMS_FOR_ORDER_PAGE,
});

export const getOrderItems_ForOrderPageSuccess = (data) => ({
  type: GET_ORDER_ITEMS_FOR_ORDER_PAGE_SUCCESS,
  payload: data,
});
export const submitOrder_fromOrderPage = (data,id) => ({
  type: SUBMIT_ORDER_FROM_ORDER_PAGE,
  data,id,
});
export const submitOrder_fromOrderPage_Success = (data) => ({
  type: SUBMIT_ORDER_FROM_ORDER_PAGE_SUCCESS,
  payload: data
});
export const getOrderList = (data) => ({
  type: GET_ORDER_LIST,
  data,
});

export const getOrderListSuccess = (data) => ({
  type: GET_ORDER_LIST_SUCCESS,
  payload: data,
});

export const getOrderListMessage = (ordersListMessage) => ({
  type: GET_ORDER_LIST_MESSAGE,
  payload: ordersListMessage,
});

export const editOrder_forOrderPage = (id) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE,
  id,
});
export const editOrder_forOrderPage_Success = (data) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  payload: data,
});

export const updateOrderID_From_OrderPage = (data, id) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  data, id,
});
export const updateOrderID_From_OrderPageSuccess = (data) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  payload: data,
});


export const deleteOrderID_From_OrderPage = (id) => ({
  type: DELETE_ORDER_FOR_ORDER_PAGE,
  id,
});
export const deleteOrderID_From_OrderPageSuccess = (data) => ({
  type: DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS,
  payload: data,
});


export const getDivisionOrders = () => ({
  type: GET_DIVISIONORDER_LIST,
});

export const getDivisionOrdersSuccess = orders => ({
  type: GET_DIVISIONORDER_LIST_SUCCESS,
  payload: orders,
})

