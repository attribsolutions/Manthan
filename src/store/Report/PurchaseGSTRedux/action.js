import { POST_PURCHASE_GST_REPORT_API, POST_PURCHASE_GST_REPORT_API_SUCCESS, POST_PURCHASE_GST_REPORT_API_ERROR_ACTION } from "./actionType";

export const postPurchaseGSTReport_API = (config = {}) => ({ // save Action
    type: POST_PURCHASE_GST_REPORT_API,
    config,
});

export const postPurchaseGSTReport_API_Success = (resp) => ({ // Save  success
    type: POST_PURCHASE_GST_REPORT_API_SUCCESS,
    payload: resp,
});


export const postPurchaseGSTReportApiErrorAction = () => ({
    type: POST_PURCHASE_GST_REPORT_API_ERROR_ACTION,
})
