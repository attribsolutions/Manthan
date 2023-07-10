import {
    STOCK_REPORT_API_ERROR_ACTION,
    STOCK_REPORT_GO_BUTTON_API,
    STOCK_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

export const stockReport_GoButton_API = (config = {}) => ({ // save Action
    type: STOCK_REPORT_GO_BUTTON_API,
    config,
});

export const stockReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: STOCK_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

export const stockReportApiErrorAction = () => ({
    type: STOCK_REPORT_API_ERROR_ACTION,
})