import {
    PERIODIC_GRN_REPORT,
    PERIODIC_GRN_REPORT_ERROR_ACTION,
    PERIODIC_GRN_REPORT_SUCCESS,
} from "./actionType";

export const Periodic_GRN_Report = (config = {}) => ({ // save Action
    type: PERIODIC_GRN_REPORT,
    config,
});

export const Periodic_GRN_Report_Success = (resp) => ({ // Save  success
    type: PERIODIC_GRN_REPORT_SUCCESS,
    payload: resp,
});

// ***************** Error Action ******************
export const Periodic_GRN_Report_ErrorAction = () => ({
    type: PERIODIC_GRN_REPORT_ERROR_ACTION,
})

