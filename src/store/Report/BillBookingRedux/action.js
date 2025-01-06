import {
    BILLBOOKING_REPORT_ACTION,
    BILLBOOKING_REPORT_ACTION_SUCCESS,
    BILLBOOKING_REPORT_ERROR_ACTION,

} from "./actionType";

export const BillBooking_Report_Action = (config) => ({
    type: BILLBOOKING_REPORT_ACTION,
    config
});

export const BillBooking_Report_Action_Success = resp => ({
    type: BILLBOOKING_REPORT_ACTION_SUCCESS,
    payload: resp,
})

export const BillBooking_Report_ErrorAction = resp => ({
    type: BILLBOOKING_REPORT_ERROR_ACTION,
    payload: resp,
})
