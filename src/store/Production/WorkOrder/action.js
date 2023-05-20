import {
  DELETE_WORK_ORDER_LIST_PAGE,
  DELETE_WORK_ORDER_LIST_PAGE_SUCCESS,
  EDIT_WORK_ORDER_LIST_ID,
  EDIT_WORK_ORDER_LIST_ID_SUCCESS,
  GET_BOM_LIST,
  GET_BOM_LIST_SUCCESS,
  GET_WORK_ORDER_LIST_PAGE,
  GET_WORK_ORDER_LIST_PAGE_SUCCESS,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
  POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
  POST_WORK_ORDER_MASTER,
  POST_WORK_ORDER_MASTER_SUCCESS,
  UPDATE_WORK_ORDER_LIST,
  UPDATE_WORK_ORDER_LIST_SUCCESS,
} from "./actionTypes";



// get BOMList 
export const getBOMList = (filters) => ({                                          //Get BOM List filter Api
  type: GET_BOM_LIST,
  filters
});

export const getBOMListSuccess = (data) => ({                                     //Get BOM List filterSuccess Action
  type: GET_BOM_LIST_SUCCESS,
  payload: data,
});

export const postGoButtonForWorkOrder_Master = (jsonbody, btnId) => ({             //post Action For go button
  type: POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
  jsonbody, btnId
});

export const postGoButtonForWorkOrder_MasterSuccess = (data) => ({             //post Action For go button Success
  type: POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
  payload: data,
});

// Go Button Post API
export const SaveWorkOrderMaster = (config={}) => ({                     //Post Action For work Order
  type: POST_WORK_ORDER_MASTER,
  config,
});

export const SaveWorkOrderMasterSuccess = (data) => ({                         //Post Action For work Order Success
  type: POST_WORK_ORDER_MASTER_SUCCESS,
  payload: data,
});

export const getWorkOrderListPage = (filters) => ({                           //GEt action for work orde list page
  type: GET_WORK_ORDER_LIST_PAGE,
  filters,
});

export const getWorkOrderListPageSuccess = (data) => ({                      //GEt action for work orde list page Success
  type: GET_WORK_ORDER_LIST_PAGE_SUCCESS,
  payload: data,
});

export const editWorkOrderList = (config = {}) => ({                          //Edit Action
  type: EDIT_WORK_ORDER_LIST_ID,
  config,
})

export const editWorkOrderListSuccess = (editData) => ({                         //Edit Action Success
  type: EDIT_WORK_ORDER_LIST_ID_SUCCESS,
  payload: editData,
})

export const updateWorkOrderList = (config = {}) => ({                         //  Update Action
  type: UPDATE_WORK_ORDER_LIST,
  config,
});
export const updateWorkOrderListSuccess = (resp) => ({                          //  Update Action Success 
  type: UPDATE_WORK_ORDER_LIST_SUCCESS,
  payload: resp,
});

export const deleteWorkOrderId = (config={}) => ({                                   //Delete Action 
  type: DELETE_WORK_ORDER_LIST_PAGE,
  config,
});
export const deleteWorkOrderIdSuccess = (resp) => ({                            //Delete Action  Success
  type: DELETE_WORK_ORDER_LIST_PAGE_SUCCESS,
  payload: resp,
});
