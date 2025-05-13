import {
    MANAGER_SUMMARY_REPORT_API_ERROR_ACTION,
    MANAGER_SUMMARY_REPORT_GO_BUTTON_API,
    MANAGER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS,

} from "./actionType";

const INIT_STATE = {
    ManagerSummary: { Status: false },
    listBtnLoading: false,
}

const ManagerSummaryReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case MANAGER_SUMMARY_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.goBtnMode
            }

        case MANAGER_SUMMARY_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                ManagerSummary: action.payload,
                listBtnLoading: false
            }


        case MANAGER_SUMMARY_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default ManagerSummaryReportReducer  