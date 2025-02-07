import {
    GRN_DISCREPANCY_REPORT_ACTION,
    GRN_DISCREPANCY_REPORT_ACTION_SUCCESS,
    GRN_DISCREPANCY_REPORT_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    GRNDiscrepancyData: [],
    listBtnLoading: false
}

const GRNDiscrepancyReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GRN_DISCREPANCY_REPORT_ACTION:
            return {
                ...state,
                listBtnLoading: action?.config?.Mode
            }

        case GRN_DISCREPANCY_REPORT_ACTION_SUCCESS:
            return {
                ...state,
                GRNDiscrepancyData: action.payload,
                listBtnLoading: false
            }


        case GRN_DISCREPANCY_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default GRNDiscrepancyReportReducer  