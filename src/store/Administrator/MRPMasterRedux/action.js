import { POST_GO_BUTTON_DATA, POST_GO_BUTTON_DATA_SUCCESS, POST_MRP_MASTER_DATA, POST_MRP_MASTER_DATA_SUCCESS } from "./actionTypes";

// MRP Post API
export const postMRPMasterData = (Data,) => ({
    type: POST_MRP_MASTER_DATA,
    Data,
});

export const postMRPMasterDataSuccess = (data) => ({
    type: POST_MRP_MASTER_DATA_SUCCESS,
    payload: data,
});

// Go Button Post API
export const postGoButtonData = (data,) => ({
    type: POST_GO_BUTTON_DATA,
    data,
});

export const postGoButtonDataSuccess = (data) => ({
    type: POST_GO_BUTTON_DATA_SUCCESS,
    payload: data,
});