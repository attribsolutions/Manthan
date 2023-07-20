import { RETAILER_DATA_API_ERROR_ACTION, POST_RETAILER_DATA_API, POST_RETAILER_DATA_API_SUCCESS } from "./actionType";

export const postRetailerData_API = (config = {}) => ({ // save Action
    type: POST_RETAILER_DATA_API,
    config,
});

export const postRetailerData_API_Success = (resp) => ({ // Save  success
    type: POST_RETAILER_DATA_API_SUCCESS,
    payload: resp,
});


export const RetailerDataApiErrorAction = () => ({
    type: RETAILER_DATA_API_ERROR_ACTION,
})
