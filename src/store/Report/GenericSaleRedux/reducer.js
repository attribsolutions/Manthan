import {
    GENERIC_SALE_REPORT_API_ERROR_ACTION,
    GO_BUTTON_FOR_GENERIC_SALE_ACTION,
    GO_BUTTON_FOR_GENERIC_SALE_SUCCESS,

} from "./actionType"

const INIT_STATE = {
    genericSaleGobtn: [],
    GoBtnLoading: false,
    ExcelBtnLoading: false
}

const GenericSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GO_BUTTON_FOR_GENERIC_SALE_ACTION:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading: action.config.btnId
            }

        case GO_BUTTON_FOR_GENERIC_SALE_SUCCESS:
            return {
                ...state,
                genericSaleGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            }

        case GENERIC_SALE_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            };


        default:
            return state
    }
}

export default GenericSaleReportReducer  