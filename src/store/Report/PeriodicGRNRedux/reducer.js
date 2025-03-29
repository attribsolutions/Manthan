import {
    PERIODIC_GRN_REPORT,
    PERIODIC_GRN_REPORT_ERROR_ACTION,
    PERIODIC_GRN_REPORT_SUCCESS,

} from "./actionType";

const INIT_STATE = {
    BtnLoading: false,
    PrediocGrnData: { status: false }
}

const PeriodicGrnReportReducer = (state = INIT_STATE, action) => {

    switch (action.type) {
        case PERIODIC_GRN_REPORT:
            return {
                ...state,
                BtnLoading: action.config.btnMode,
            }

        case PERIODIC_GRN_REPORT_SUCCESS:
            return {
                ...state,
                PrediocGrnData: action.payload,
                BtnLoading: false
            }

        case PERIODIC_GRN_REPORT_ERROR_ACTION:
            return {
                ...state,
                BtnLoading: false
            };

        default:
            return state
    }
}

export default PeriodicGrnReportReducer  