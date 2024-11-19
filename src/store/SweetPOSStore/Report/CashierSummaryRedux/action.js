import {
    CASHIER_SUMMARY_REPORT_API_ERROR_ACTION,
    CASHIER_SUMMARY_REPORT_GO_BUTTON_API,
    CASHIER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,
   
} from "./actionType";

export const CashierSummaryReport_GoButton_API = (config = {}) => ({ // save Action
    type: CASHIER_SUMMARY_REPORT_GO_BUTTON_API,
    config,
});

export const CashierSummaryReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: CASHIER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************

export const CashierSummaryApiErrorAction = () => ({
    type: CASHIER_SUMMARY_REPORT_API_ERROR_ACTION,
})

