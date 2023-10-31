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

    stockProcessingLoading: false,
    SR_GoBtnLoading: false,
    GoBtnLoading: false,
    ExcelBtnLoading: false,
}

const StockReportReducer = (state = INIT_STATE, action) => {
    
    switch (action.type) {
        case STOCK_REPORT_GO_BUTTON_API:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading:action.config.btnId,
            }

        case STOCK_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                StockReportGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false,
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
                stockProcessingLoading: false,
                SR_GoBtnLoading: false,
                GoBtnLoading: false,
                ExcelBtnLoading: false,
            };

        default:
            return state
    }
}

export default StockReportReducer  