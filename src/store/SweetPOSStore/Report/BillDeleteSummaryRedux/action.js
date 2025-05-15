import {
    BILL_DELETE_SUMMARY_REPORT_API_ERROR_ACTION,
    BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API,
    BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,
   
} from "./actionType";

export const BillDeleteSummaryReport_GoButton_API = (config) => ({
    type: BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API,
    config,
});
    
export const  BillDeleteSummaryReport_GoButton_API_Success = (resp) => ({ // Save  success
    type: BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************

export const BillDeleteSummaryApiErrorAction = () => ({
    type: BILL_DELETE_SUMMARY_REPORT_API_ERROR_ACTION,
})

