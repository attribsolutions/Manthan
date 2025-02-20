import { CODE_REDEMPTION_REPORT_ACTION, CODE_REDEMPTION_REPORT_ACTION_SUCCESS, CODE_REDEMPTION_REPORT_ERROR_ACTION } from "./actionType";

export const CodeRedemption_Report_Action = (config) => ({
    type: CODE_REDEMPTION_REPORT_ACTION,
    config
});

export const CodeRedemption_Report_Action_Success = resp => ({
    type: CODE_REDEMPTION_REPORT_ACTION_SUCCESS,
    payload: resp,
})

export const CodeRedemption_Report_ErrorAction = resp => ({
    type: CODE_REDEMPTION_REPORT_ERROR_ACTION,
    payload: resp,
})
