import {
    GST_R1_REPORT_API,
    GST_R1_REPORT_API_SUCCESS,
    GST_R1_REPORT_API_ERROR_ACTION,
    GST_R3B_REPORT_API,
    GST_R3B_REPORT_API_SUCCESS,

} from "./actionType";

export const GST_R1_Report_API = (config = {}) => ({ // save Action
    type: GST_R1_REPORT_API,
    config,
});

export const GST_R1_Report_API_Success = (resp) => ({ // Save  success
    type: GST_R1_REPORT_API_SUCCESS,
    payload: resp,
});


export const GST_R3B_Report_API = (config = {}) => ({ // save Action
    type: GST_R3B_REPORT_API,
    config,
});

export const GST_R3B_Report_API_Success = (resp) => ({ // Save  success
    type: GST_R3B_REPORT_API_SUCCESS,
    payload: resp,
});

export const GST_R1_Report_API_ErrorAction = () => ({
    type: GST_R1_REPORT_API_ERROR_ACTION,
})
