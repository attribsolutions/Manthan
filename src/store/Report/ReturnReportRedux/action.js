import {
    RETURN_REPORT_ACTION,
    RETURN_REPORT_ACTION_SUCCESS,
    RETURN_REPORT_ERROR_ACTION
} from "./actionType";

export const Return_Report_Action = (config) => ({
    type: RETURN_REPORT_ACTION,
    config
});

export const Return_Report_Action_Success = resp => ({
    type: RETURN_REPORT_ACTION_SUCCESS,
    payload: resp,
})

export const Return_Report_ErrorAction = resp => ({
    type: RETURN_REPORT_ERROR_ACTION,
    payload: resp,
})
