import {
    BILLBOOKING_REPORT_ACTION,
    BILLBOOKING_REPORT_ACTION_SUCCESS,
    BILLBOOKING_REPORT_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    returnReportData: [],
}

const BillBookingReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case BILLBOOKING_REPORT_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId
            }

        case BILLBOOKING_REPORT_ACTION_SUCCESS:
            return {
                ...state,
                returnReportData: action.payload,
                listBtnLoading: false
            }


        case BILLBOOKING_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default BillBookingReportReducer  