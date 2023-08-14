import {
    GST_R1_REPORT_API,
    GST_R1_REPORT_API_SUCCESS,
    GST_R1_REPORT_API_ERROR_ACTION,
    GST_R3B_REPORT_API,
    GST_R3B_REPORT_API_SUCCESS
} from "./actionType";

const INIT_STATE = {
    GstR1ReportData: [],
    GstR3BReportData: [],
    GstR1BtnLoading: false,
    GstR3BBtnLoading: false,
}

const GSTR1ReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GST_R1_REPORT_API:
            return {
                ...state,
                GstR1BtnLoading: true
            }

        case GST_R1_REPORT_API_SUCCESS:
            return {
                ...state,
                GstR1ReportData: action.payload,
                GstR1BtnLoading: false
            }

        case GST_R3B_REPORT_API:
            return {
                ...state,
                GstR3BBtnLoading: true
            }

        case GST_R3B_REPORT_API_SUCCESS:
            return {
                ...state,
                GstR3BReportData: action.payload,
                GstR3BBtnLoading: false
            }

        case GST_R1_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                GstR3BBtnLoading: false,
                GstR1BtnLoading: false
            };
        default:
            return state
    }
}

export default GSTR1ReportReducer  