import {
    RETURN_REPORT_ACTION,
    RETURN_REPORT_ACTION_SUCCESS,
    RETURN_REPORT_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    returnReportData: [],
}

const ReturnReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case RETURN_REPORT_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId
            }

        case RETURN_REPORT_ACTION_SUCCESS:
            return {
                ...state,
                returnReportData: action.payload,
                listBtnLoading: false
            }


        case RETURN_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default ReturnReportReducer  