import { ORDER_SUMMARY_API_ERROR_ACTION, POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    orderSummaryGobtn: [],
    GoBtnLoading: false,
    ExcelBtnLoading: false
}

const OrderSummaryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_ORDER_SUMMARY_API:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading: action.config.btnId
            }

        case POST_ORDER_SUMMARY_API_SUCCESS:
            return {
                ...state,
                orderSummaryGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            }

        case ORDER_SUMMARY_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            };


        default:
            return state
    }
}

export default OrderSummaryReducer  