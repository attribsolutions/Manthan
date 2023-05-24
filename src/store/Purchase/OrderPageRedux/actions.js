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
  SAVE_ORDER_FROM_ORDER_PAGE_SUCCESS,
  SAVE_ORDER_FROM_ORDER_PAGE,
  GET_ORDER_LIST_PAGE,
  GET_ORDER_LIST_PAGE_SUCCESS,
  ORDER_APPROVAL_ACTION,
  ORDER_APPROVAL_ACTION_SUCCESS,
  GET_ORDER_APPROVAL_DETAIL,
  GET_ORDER_APPROVAL_DETAIL_SUCCESS,
} from './actionType'

export const GoButton_For_Order_Add = (config) => ({
  type: GO_BUTTON_FOR_ORDER_PAGE,
 config
});

export const GoButton_For_Order_AddSuccess = list => ({
  type: GO_BUTTON_FOR_ORDER_PAGE_SUCCESS,
  payload: list,
})

//get listpage api
export const getOrderListPage = (config = {}) => ({
  type: GET_ORDER_LIST_PAGE,
  config,
});

export const getOrderListPageSuccess = (resp) => ({
  type: GET_ORDER_LIST_PAGE_SUCCESS,
  payload: resp,
});


export const saveOrderAction = (config = {}) => ({
  type: SAVE_ORDER_FROM_ORDER_PAGE,
  config,
});
export const saveOrderActionSuccess = (resp) => ({
  type: SAVE_ORDER_FROM_ORDER_PAGE_SUCCESS,
  payload: resp
});


export const editOrderId = (config = {}) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE,
  config,
});
export const editOrderIdSuccess = (resp) => ({
  type: EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  payload: resp,
});

export const updateOrderIdAction = (config = {}) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  config,
});
export const updateOrderIdSuccess = (data) => ({
  type: UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  payload: data,
});


export const deleteOrderId = (config) => ({
  type: DELETE_ORDER_FOR_ORDER_PAGE,
  config,
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



export const getOrderApprovalDetailAction = (config) => ({
  type: GET_ORDER_APPROVAL_DETAIL,
  config
});

export const getOrderApprovalDetailActionSucc = resp => ({
  type: GET_ORDER_APPROVAL_DETAIL_SUCCESS,
  payload: resp,
})
export const orderApprovalAction = (config) => ({
  type: ORDER_APPROVAL_ACTION,
  config
});

export const orderApprovalActionSuccess = resp => ({
  type: ORDER_APPROVAL_ACTION_SUCCESS,
  payload: resp,
})


