import { POST_PURCHASE_GST_REPORT_API, POST_PURCHASE_GST_REPORT_API_SUCCESS, POST_PURCHASE_GST_REPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
    PurchaseGSTGobtn: [],
    GoBtnLoading: false,
    ExcelBtnLoading: false
}

const PurchaseGSTReportReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case POST_PURCHASE_GST_REPORT_API:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading: action.config.btnId

            }

        case POST_PURCHASE_GST_REPORT_API_SUCCESS:
            return {
                ...state,
                PurchaseGSTGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false

            }
        case POST_PURCHASE_GST_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            };
        default:
            return state
    }
}

export default PurchaseGSTReportReducer  