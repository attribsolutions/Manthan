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
export const getOrderListPage = (config={}) => ({
  type: GET_ORDER_LIST_PAGE,
 config,
});

export const getOrderListPageSuccess = (resp) => ({
  type: GET_ORDER_LIST_PAGE_SUCCESS,
  payload: resp,
});


export const saveOrderAaction = (config = {}) => ({
  type: POST_ORDER_FROM_ORDER_PAGE,
  config,
});
export const postOrderSuccess = (resp) => ({
  type: POST_ORDER_FROM_ORDER_PAGE_SUCCESS,
  payload: resp
});


export const editOrderId = (jsonBody, pageMode) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE,
  jsonBody, pageMode
});
export const editOrderIdSuccess = (data) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  payload: data,
});

export const updateOrderIdAction = (config = {}) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  config,
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


