import { POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType";

export const postOrderSummary_API = (config = {}) => ({ // save Action
    type: POST_ORDER_SUMMARY_API,
    config,
});

export const postOrderSummary_API_Success = (resp) => ({ // Save  success
    type: POST_ORDER_SUMMARY_API_SUCCESS,
    payload: resp,
});

