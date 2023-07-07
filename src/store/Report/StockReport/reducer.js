import {
    STOCK_REPORT_API_ERROR_ACTION,
    STOCK_REPORT_GO_BUTTON_API,
    STOCK_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

const INIT_STATE = {
    StockReportGobtn: [],
    listBtnLoading: false
}

const StockReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case STOCK_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: true
            }

        case STOCK_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                StockReportGobtn: action.payload,
                listBtnLoading: false
            }

        case STOCK_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };


        default:
            return state
    }
}

export default StockReportReducer  