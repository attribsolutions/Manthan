import { CODE_REDEMPTION_REPORT_ACTION, CODE_REDEMPTION_REPORT_ACTION_SUCCESS, CODE_REDEMPTION_REPORT_ERROR_ACTION } from "./actionType"

const INIT_STATE = {
    CodeRedemptionData: [],
    listBtnLoading: false
}

const CodeRedemptionReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case CODE_REDEMPTION_REPORT_ACTION:
            return {
                ...state,
                listBtnLoading: action?.config?.Mode
            }

        case CODE_REDEMPTION_REPORT_ACTION_SUCCESS:
            return {
                ...state,
                CodeRedemptionData: action.payload,
                listBtnLoading: false
            }


        case CODE_REDEMPTION_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default CodeRedemptionReportReducer  