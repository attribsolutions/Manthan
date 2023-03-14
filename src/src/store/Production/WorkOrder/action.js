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
    WORK_ORDER_LIST_FILTERS
} from "./actionTypes";

export const WorkOrderlistfilters = filter => ({
  type:WORK_ORDER_LIST_FILTERS,
  payload: filter,
})


// get BOMList 
export const getBOMList = (filters) => ({
    type: GET_BOM_LIST,
    filters
});

export const getBOMListSuccess = (data) => ({
    type: GET_BOM_LIST_SUCCESS,
    payload: data,
});

// Go Button Post API
export const postGoButtonForWorkOrder_Master = (jsonbody,btnId) => ({
    type: POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
    jsonbody,btnId
});

export const postGoButtonForWorkOrder_MasterSuccess = (data) => ({
    type: POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
    payload: data,
});


// Go Button Post API
export const SaveWorkOrderMaster = (jsonbody,btnId) => ({
    type: POST_WORK_ORDER_MASTER,
    jsonbody,btnId
});

export const SaveWorkOrderMasterSuccess = (data) => ({
    type: POST_WORK_ORDER_MASTER_SUCCESS,
    payload: data,
});

//get listpage api
export const getWorkOrderListPage = (filters) => ({
    type: GET_WORK_ORDER_LIST_PAGE,
    filters,
  });
  
  export const getWorkOrderListPageSuccess = (data) => ({
    type:GET_WORK_ORDER_LIST_PAGE_SUCCESS,
    payload: data,
  });
  
   // edit api
   export const editWorkOrderList =(id1,pageMode)=>({
    type:EDIT_WORK_ORDER_LIST_ID,
    id1,pageMode
  })
  
  export const editWorkOrderListSuccess =(editData)=>({
    type:EDIT_WORK_ORDER_LIST_ID_SUCCESS,
   payload:editData,
  })
  
  export const updateWorkOrderList = (data, id1) => ({
    type: UPDATE_WORK_ORDER_LIST,
    data, id1,
  });
  export const updateWorkOrderListSuccess = (data) => ({
    type: UPDATE_WORK_ORDER_LIST_SUCCESS,
    payload: data,
  });
  
  export const deleteWorkOrderId = (id) => ({
    type: DELETE_WORK_ORDER_LIST_PAGE,
    id,
  });
  export const deleteWorkOrderIdSuccess = (data) => ({
    type: DELETE_WORK_ORDER_LIST_PAGE_SUCCESS,
    payload: data,
  });
  