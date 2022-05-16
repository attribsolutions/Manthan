import{
  EDIT_ORDER,
  EDIT_ORDER_SUCCESS,
  GET_DIVISIONORDER_LIST,
  GET_DIVISIONORDER_LIST_SUCCESS,
  GET_ORDER_LIST,
    GET_ORDER_LIST_MESSAGE,
    GET_ORDER_LIST_SUCCESS,
    GET_ORDER_PAGE,
    GET_ORDER_PAGE_SUCCESS,
    SUBMIT_ORDER_PAGE,
    SUBMIT_ORDER_PAGE_SUCCESS
}from './actionType'

export const getOrderPage = () => ({
    type: GET_ORDER_PAGE,
  });

  export const getOrderPageSuccess = (orders) => ({
    type: GET_ORDER_PAGE_SUCCESS,
    payload:orders,
  });
  export const submitOrderPage = (data) => ({
    type: SUBMIT_ORDER_PAGE,
   data,
  });
  export const submitOrderPageSuccess = (submitOrderSuccess) => ({
    type: SUBMIT_ORDER_PAGE_SUCCESS,
    payload:submitOrderSuccess
  });
  export const getOrderList = (listData) => ({
    type: GET_ORDER_LIST,
    listData,
  });

  export const getOrderListSuccess = (ordersList) => ({
    type: GET_ORDER_LIST_SUCCESS,
    payload:ordersList,
  });
  
  export const getOrderListMessage = (ordersListMessage) => ({
    type: GET_ORDER_LIST_MESSAGE,
    payload:ordersListMessage,
  });

  export const editOrder = (orderId) => ({
    type: EDIT_ORDER,
    orderId,
  });
  export const editOrderSuccess = (editOrdersData) => ({
    type: EDIT_ORDER_SUCCESS,
    payload:editOrdersData,
  });


  export const getDivisionOrders = () => ({
    type: GET_DIVISIONORDER_LIST,
    });

    export const getDivisionOrdersSuccess = orders => ({
      type: GET_DIVISIONORDER_LIST_SUCCESS,
      payload: orders,
    })
  