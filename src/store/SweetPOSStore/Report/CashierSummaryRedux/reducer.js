import {
    CASHIER_SUMMARY_REPORT_API_ERROR_ACTION,
    CASHIER_SUMMARY_REPORT_GO_BUTTON_API,
    CASHIER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,

} from "./actionType";

const INIT_STATE = {
    CashierSummary: [],
    listBtnLoading: false,
}

const CashierSummaryReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case CASHIER_SUMMARY_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.btnId
            }

        case CASHIER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                CashierSummary: action.payload,
                listBtnLoading: false
            }


        case CASHIER_SUMMARY_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default CashierSummaryReportReducer  