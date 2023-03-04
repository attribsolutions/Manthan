import {
    // UPDATE_ORDER_ID_FROM_ORDER_PAGE,
    // UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
    // EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
    // EDIT_ORDER_FOR_ORDER_PAGE,
    GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
    GO_BUTTON_FOR_CREDITLIMIT_PAGE,
    POST_CREDITLIMIT_PAGE_SUCCESS,
    POST_CREDITLIMIT_PAGE,
    GET_ROUTESDROPDOWN,
    GET_ROUTESDROPDOWN_SUCCESS,
    // GET_ORDER_LIST_PAGE,
    // GET_ORDER_LIST_PAGE_SUCCESS,

  } from './actionTypes'
  
//   export const orderlistfilters = filter => ({
//     type: ORDER_LIST_FILTERS,
//     payload: filter,
//   })
  
  export const GoButton_For_CreditLimit_Add = (subPageMode, data) => ({
    type: GO_BUTTON_FOR_CREDITLIMIT_PAGE,
    subPageMode, data,
  });
  
  export const GoButton_For_CreditLimit_AddSuccess = list => ({
    type: GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
    payload: list,
  })
  
  //get listpage api
//   export const getOrderListPage = (subPageMode, pageMode, jsonBody) => ({
//     type: GET_ORDER_LIST_PAGE,
//     subPageMode, pageMode, jsonBody,
//   });
  
//   export const getOrderListPageSuccess = (data) => ({
//     type: GET_ORDER_LIST_PAGE_SUCCESS,
//     payload: data,
//   });
  
  
  export const postCreditLimit = (jsonBody, subPageMode) => ({
    type: POST_CREDITLIMIT_PAGE,
    jsonBody, subPageMode,
  });
  export const postCreditLimitSuccess = (msg) => ({
    type: POST_CREDITLIMIT_PAGE_SUCCESS,
    payload: msg
  });
  
  
//   export const editOrderId = (jsonBody, pageMode) => ({
//     type: EDIT_ORDER_FOR_ORDER_PAGE,
//     jsonBody, pageMode
//   });
//   export const editOrderIdSuccess = (data) => ({
//     type: EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
//     payload: data,
//   });
  
//   export const updateOrderId = (data, id) => ({
//     type: UPDATE_ORDER_ID_FROM_ORDER_PAGE,
//     data, id,
//   });
//   export const updateOrderIdSuccess = (data) => ({
//     type: UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
//     payload: data,
//   });
  
  
  export const getRoutesDropdown= () => ({
    type: GET_ROUTESDROPDOWN ,
  });
  
  export const getRoutesDropdownSuccess = creditlimits => ({
    type:GET_ROUTESDROPDOWN_SUCCESS,
    payload: creditlimits,
  })
  
  
  