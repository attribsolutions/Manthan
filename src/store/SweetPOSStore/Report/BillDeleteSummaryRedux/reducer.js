import {
    BILL_DELETE_SUMMARY_REPORT_API_ERROR_ACTION,
    BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API,
    BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,

} from "./actionType";

const INIT_STATE = {
    BillDeleteSummaryData: { Status: false },
    listBtnLoading: false,
}

const BillDeleteSummaryReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.goBtnMode
            }

        case BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                BillDeleteSummaryData: action.payload,
                listBtnLoading: false
            }


        case BILL_DELETE_SUMMARY_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default BillDeleteSummaryReportReducer  
