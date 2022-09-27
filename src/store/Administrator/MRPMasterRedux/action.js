import { POST_MRP_MASTER_DATA, POST_MRP_MASTER_DATA_SUCCESS } from "./actionTypes";

// post api
export const postMRPMasterData = (Data,) => ({
    type: POST_MRP_MASTER_DATA,
    Data, 
});

export const postMRPMasterDataSuccess = (data) => ({
    type: POST_MRP_MASTER_DATA_SUCCESS,
    payload: data,
});