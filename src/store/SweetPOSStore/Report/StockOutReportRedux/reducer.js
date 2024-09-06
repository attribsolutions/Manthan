import {
    GO_BUTTON_FOR_STOCK_OUT_ACTION,
    GO_BUTTON_FOR_STOCK_OUT_SUCCESS,
    STOCK_OUT_REPORT_ERROR_ACTION,

} from "./actionType"

const INIT_STATE = {
    stockOutListData: [],
    listBtnLoading: false,
}

const StockOutReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case GO_BUTTON_FOR_STOCK_OUT_ACTION:
            return {
                ...state,
                listBtnLoading: true,
            }

        case GO_BUTTON_FOR_STOCK_OUT_SUCCESS:
            return {
                ...state,
                stockOutListData: action.payload,
                listBtnLoading: false,
            }

        case STOCK_OUT_REPORT_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default StockOutReportReducer  