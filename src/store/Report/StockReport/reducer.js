import {
    STOCK_PROCESSING_ACTION,
    STOCK_PROCESSING_API_SUCCESS,
    STOCK_REPORT_1_GO_BUTTON_API,
    STOCK_REPORT_1_GO_BUTTON_API_SUCCESS,
    STOCK_REPORT_API_ERROR_ACTION,
    STOCK_REPORT_GO_BUTTON_API,
    STOCK_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

const INIT_STATE = {
    StockReportGobtn: [],
    StockProcessingBtn: [],
    StockReport_1_Gobtb: [],

    listBtnLoading: false,
    stockProcessingLoading: false,
    SR_GoBtnLoading: false
}

const StockReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case STOCK_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.btnId
            }

        case STOCK_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                StockReportGobtn: action.payload,
                listBtnLoading: false
            }

        //*************** */ Stock Report 1 ***************************
        case STOCK_PROCESSING_ACTION:
            return {
                ...state,
                stockProcessingLoading: true
            }

        case STOCK_PROCESSING_API_SUCCESS:
            return {
                ...state,
                StockProcessingBtn: action.payload,
                stockProcessingLoading: false
            }

        case STOCK_REPORT_1_GO_BUTTON_API:
            return {
                ...state,
                SR_GoBtnLoading: action.config.btnId
            }

        case STOCK_REPORT_1_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                StockReport_1_Gobtb: action.payload,
                SR_GoBtnLoading: false
            }

        case STOCK_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
                stockProcessingLoading: false,
                SR_GoBtnLoading: false
            };

        default:
            return state
    }
}

export default StockReportReducer  