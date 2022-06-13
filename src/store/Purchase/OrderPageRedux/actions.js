import{
  EDIT_ORDER,
  EDIT_ORDER_SUCCESS,
  GET_DIVISIONORDER_LIST,
  GET_DIVISIONORDER_LIST_SUCCESS,
  GET_ORDER_LIST,
    GET_ORDER_LIST_MESSAGE,
    GET_ORDER_LIST_SUCCESS,
    GET_ORDER_ITEMS_FOR_ORDER_PAGE,
    GET_ORDER_ITEMS_FOR_ORDER_PAGE_SUCCESS,
    SUBMIT_ORDER_PAGE,
    SUBMIT_ORDER_PAGE_SUCCESS
}from './actionType'

export const getOrderItems_ForOrderPage = () => ({
    type: GET_ORDER_ITEMS_FOR_ORDER_PAGE,
  });

  export const getOrderItems_ForOrderPageSuccess = (data) => ({
    type: GET_ORDER_ITEMS_FOR_ORDER_PAGE_SUCCESS,
    payload:data,
  });
  export const submitOrderPage = (data) => ({
    type: SUBMIT_ORDER_PAGE,
   data,
  });
  export const submitOrderPageSuccess = (submitOrderSuccess) => ({
    type: SUBMIT_ORDER_PAGE_SUCCESS,
    payload:submitOrderSuccess
  });
  export const getOrderList = (data) => ({
    type: GET_ORDER_LIST,
    data,
  });

  export const getOrderListSuccess = (data) => ({
    type: GET_ORDER_LIST_SUCCESS,
    payload:data,
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
  