import {
    GET_BOM_LIST,
    GET_BOM_LIST_SUCCESS,
    POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
    POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
    POST_WORK_ORDER_MASTER,
    POST_WORK_ORDER_MASTER_SUCCESS
} from "./actionTypes";

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
export const postGoButtonForWorkOrder_Master = (data,) => ({
    type: POST_GO_BUTTON_FOR_WORK_ORDER_MASTER,
    data,
});

export const postGoButtonForWorkOrder_MasterSuccess = (data) => ({
    type: POST_GO_BUTTON_FOR_WORK_ORDER_MASTER_SUCCESS,
    payload: data,
});


// Go Button Post API
export const postWorkOrderMaster = (Data) => ({
    type: POST_WORK_ORDER_MASTER,
    Data,
});

export const postWorkOrderMasterSuccess = (data) => ({
    type: POST_WORK_ORDER_MASTER_SUCCESS,
    payload: data,
});