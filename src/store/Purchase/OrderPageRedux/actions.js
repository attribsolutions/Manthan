import {
  GET_DIVISIONORDER_LIST,
  GET_DIVISIONORDER_LIST_SUCCESS,

  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE,
  DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS,
  GO_BUTTON_FOR_ORDER_PAGE_SUCCESS,
  GO_BUTTON_FOR_ORDER_PAGE,
  POST_ORDER_FROM_ORDER_PAGE_SUCCESS,
  POST_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE,
  GET_ORDER_LIST_PAGE_SUCCESS,
  ORDER_LIST_FILTERS,
  // ORDER_ADD_FILTERS
} from './actionType'


// export const orderAddfilters = filter => ({
//   type: ORDER_ADD_FILTERS,
//   payload: filter,
// })
export const orderlistfilters = filter => ({
  type: ORDER_LIST_FILTERS,
  payload: filter,
})

export const GoButton_For_Order_Add = (subPageMode, data) => ({
  type: GO_BUTTON_FOR_ORDER_PAGE,
  subPageMode, data,
});

export const GoButton_For_Order_AddSuccess = list => ({
  type: GO_BUTTON_FOR_ORDER_PAGE_SUCCESS,
  payload: list,
})

//get listpage api
export const getOrderListPage = (subPageMode, pageMode, jsonBody) => ({
  type: GET_ORDER_LIST_PAGE,
  subPageMode, pageMode, jsonBody,
});

export const getOrderListPageSuccess = (data) => ({
  type: GET_ORDER_LIST_PAGE_SUCCESS,
  payload: data,
});


export const postOrder = (jsonBody, subPageMode) => ({
  type: POST_ORDER_FROM_ORDER_PAGE,
  jsonBody, subPageMode,
});
export const postOrderSuccess = (msg) => ({
  type: POST_ORDER_FROM_ORDER_PAGE_SUCCESS,
  payload: msg
});


export const editOrderId = (jsonBody, pageMode) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE,
  jsonBody, pageMode
});
export const editOrderIdSuccess = (data) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  payload: data,
});

export const updateOrderId = (data, id) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  data, id,
});
export const updateOrderIdSuccess = (data) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  payload: data,
});


export const deleteOrderId = (id) => ({
  type: DELETE_ORDER_FOR_ORDER_PAGE,
  id,
});
export const deleteOrderIdSuccess = (data) => ({
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


