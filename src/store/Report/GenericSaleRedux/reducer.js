import {
    GENERIC_SALE_REPORT_API_ERROR_ACTION,
    GO_BUTTON_FOR_GENERIC_SALE_ACTION,
    GO_BUTTON_FOR_GENERIC_SALE_SUCCESS,

} from "./actionType"

const INIT_STATE = {
    genericSaleGobtn: [],
    listBtnLoading: false
}

const GenericSaleReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GO_BUTTON_FOR_GENERIC_SALE_ACTION:
            return {
                ...state,
                listBtnLoading: true
            }

        case GO_BUTTON_FOR_GENERIC_SALE_SUCCESS:
            return {
                ...state,
                genericSaleGobtn: action.payload,
                listBtnLoading: false
            }

        case GENERIC_SALE_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };


        default:
            return state
    }
}

export default GenericSaleReportReducer  