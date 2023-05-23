import {
    SAVE_MRP_MASTER,
    SAVE_MRP_MASTER_SUCCESS,
    GET_MRP_LIST,
    GET_MRP_LIST_SUCCESS,
    DELETE_MRP_LIST,
    DELETE_MRP_LIST_SUCCESS,
    GO_BUTTON_FOR_MRP_MASTER,
    GO_BUTTON_FOR_MRP_MASTER_SUCCESS,
    DELETE_MRP_MASTER_ID,
    DELETE_MRP_MASTER_ID_SUCCESS,
} from "./actionTypes";

// MRP Post API
export const saveMRPMaster = (config={}) => ({
    type: SAVE_MRP_MASTER,
    config,
});

export const saveMRPMasterSuccess = (resp) => ({
    type: SAVE_MRP_MASTER_SUCCESS,
    payload: resp,
});

// Go Button Post API
export const GoButtonForMRP_Master = (data) => ({
    type: GO_BUTTON_FOR_MRP_MASTER,
    data,
});

export const GoButtonForMRP_MasterSuccess = (resp) => ({
    type: GO_BUTTON_FOR_MRP_MASTER_SUCCESS,
    payload: resp,
});

//get listpage api
export const getMRPList = () => ({
    type: GET_MRP_LIST,
});

export const getMRPList_Success = (resp) => ({
    type: GET_MRP_LIST_SUCCESS,
    payload: resp,
});

//delete action for MRP List Page
export const deleteMRPList_Id = (config={}) => ({
    type: DELETE_MRP_LIST,
    config,
});

export const deleteMRPList_Id_Success = (resp) => ({
    type: DELETE_MRP_LIST_SUCCESS,
    payload: resp,
});

//delete action for MRP Master Page
export const deleteMRPMaster_Id = (id) => ({
    type: DELETE_MRP_MASTER_ID,
    id,
});

export const deleteMRPMaster_Id_Success = (resp) => ({
    type: DELETE_MRP_MASTER_ID_SUCCESS,
    payload: resp,
});
