import {
    MANAGER_SUMMARY_REPORT_API_ERROR_ACTION,
    MANAGER_SUMMARY_REPORT_GO_BUTTON_API,
    MANAGER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,
   
} from "./actionType";

export const ManagerSummaryReport_GoButton_API = (config = {}) => ({ // save Action
    type: MANAGER_SUMMARY_REPORT_GO_BUTTON_API,
    config,
});

export const ManagerSummaryReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: MANAGER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************

export const ManagerSummaryApiErrorAction = () => ({
    type: MANAGER_SUMMARY_REPORT_API_ERROR_ACTION,
})

