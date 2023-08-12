import {
    GST_R1_REPORT_API,
    GST_R1_REPORT_API_SUCCESS,
    GST_R1_REPORT_API_ERROR_ACTION
} from "./actionType";

const INIT_STATE = {
    GstR1ReportData: [],
    ExcelBtnLoading: false
}

const GSTR1ReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GST_R1_REPORT_API:
            return {
                ...state,
                ExcelBtnLoading: action.config.btnId
            }

        case GST_R1_REPORT_API_SUCCESS:
            return {
                ...state,
                GstR1ReportData: action.payload,
                ExcelBtnLoading: false
            }

        case GST_R1_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                ExcelBtnLoading: false
            };
        default:
            return state
    }
}

export default GSTR1ReportReducer  