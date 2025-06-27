

import { STOCK_ADJUSTMENT_REPORT_ACTION, STOCK_ADJUSTMENT_REPORT_API_ERROR_ACTION, STOCK_ADJUSTMENT_REPORT_SUCCESS } from "./actionType";

const INIT_STATE = {
    StockAdjustment_Data: [],
    goBtnLoading: false,
}

const Stock_Adjustment_Report_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case STOCK_ADJUSTMENT_REPORT_ACTION:
            return {
                ...state,
                goBtnLoading: action.config.btnId
            }

        case STOCK_ADJUSTMENT_REPORT_SUCCESS:
            return {
                ...state,
                StockAdjustment_Data: action.payload,
                goBtnLoading: false
            }

        case STOCK_ADJUSTMENT_REPORT_API_ERROR_ACTION:
            return {
                ...state,
                goBtnLoading: false,
            };
        default:
            return state


    }
}

export default Stock_Adjustment_Report_Reducer