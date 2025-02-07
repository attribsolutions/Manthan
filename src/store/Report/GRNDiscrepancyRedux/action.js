import {
    GRN_DISCREPANCY_REPORT_ACTION,
    GRN_DISCREPANCY_REPORT_ACTION_SUCCESS,
    GRN_DISCREPANCY_REPORT_ERROR_ACTION
} from "./actionType";

export const GRN_Discrepancy_Report_Action = (config) => ({
    type: GRN_DISCREPANCY_REPORT_ACTION,
    config
});

export const GRN_Discrepancy_Report_Action_Success = resp => ({
    type: GRN_DISCREPANCY_REPORT_ACTION_SUCCESS,
    payload: resp,
})

export const GRN_Discrepancy_Report_ErrorAction = resp => ({
    type: GRN_DISCREPANCY_REPORT_ERROR_ACTION,
    payload: resp,
})
