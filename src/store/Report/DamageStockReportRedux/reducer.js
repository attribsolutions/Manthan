import {
    DAMAGE_STOCK_REPORT_API_ERROR_ACTION,
    DAMAGE_STOCK_REPORT_GO_BUTTON_API,
    DAMAGE_STOCK_REPORT_GO_BUTTON_API_SUCCESS
} from "./actionType";

const INIT_STATE = {
    StockReportGobtn: [],
    listBtnLoading: false,
}

const DamageStockReportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case DAMAGE_STOCK_REPORT_GO_BUTTON_API:
            return {
                ...state,
                listBtnLoading: action.config.btnId
            }

        case DAMAGE_STOCK_REPORT_GO_BUTTON_API_SUCCESS:
            return {
                ...state,
                StockReportGobtn: action.payload,
                listBtnLoading: false
            }


        case DAMAGE_STOCK_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };

        default:
            return state
    }
}

export default DamageStockReportReducer  