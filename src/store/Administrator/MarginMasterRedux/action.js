import { POST_MARGIN_MASTER_DATA, POST_MARGIN_MASTER_DATA_SUCCESS } from "./actionType";

// post api
export const postMarginMasterData = (Data,) => ({
    type: POST_MARGIN_MASTER_DATA,
    Data, 
});

export const postMarginMasterDataSuccess = (data) => ({
    type: POST_MARGIN_MASTER_DATA_SUCCESS,
    payload: data,
});