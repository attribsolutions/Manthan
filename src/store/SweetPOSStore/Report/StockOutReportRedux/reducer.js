import {
    GO_BUTTON_FOR_STOCK_OUT_ACTION,
    GO_BUTTON_FOR_STOCK_OUT_SUCCESS,
    STOCK_OUT_REPORT_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    loadingBtn: null,
    stockOutListData: [],
    listBtnLoading: false,
}

const StockOutReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GO_BUTTON_FOR_STOCK_OUT_ACTION:
            return {
                ...state,
                listBtnLoading: true,
                loadingBtn: action.config.Btnmode,  // 1 = Show, 2 = Excel
            }

        case GO_BUTTON_FOR_STOCK_OUT_SUCCESS:
            return {
                ...state,
                stockOutListData: action.payload,
                listBtnLoading: false,
                loadingBtn: null, // ⬅️ stop Spinner 
            }

        case STOCK_OUT_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
                loadingBtn: null,  // stop Spinner 
            };

        default:
            return state
    }
}

export default StockOutReportReducer  