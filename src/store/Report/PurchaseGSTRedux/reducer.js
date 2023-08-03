import { POST_PURCHASE_GST_REPORT_API, POST_PURCHASE_GST_REPORT_API_SUCCESS, POST_PURCHASE_GST_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
    PurchaseGSTGobtn: [],
    PurchaseGSTExcleBtn: [],
    GoBtnLoading: false
}

const PurchaseGSTReportReducer = (state = INIT_STATE, action) => {
    
    switch (action.type) {

        case POST_PURCHASE_GST_REPORT_API:
            return {
                ...state,
                GoBtnLoading: true
            }

        case POST_PURCHASE_GST_REPORT_API_SUCCESS:
            return {
                ...state,
                PurchaseGSTGobtn: action.payload,
                GoBtnLoading: false
            }
        case POST_PURCHASE_GST_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
            };
        default:
            return state
    }
}

export default PurchaseGSTReportReducer  