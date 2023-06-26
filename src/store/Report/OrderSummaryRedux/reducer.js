import { ORDER_SUMMARY_API_ERROR_ACTION, POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    orderSummaryGobtn: [],
    listBtnLoading: false
}

const OrderSummaryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_ORDER_SUMMARY_API:
            return {
                ...state,
                listBtnLoading: true
            }

        case POST_ORDER_SUMMARY_API_SUCCESS:
            return {
                ...state,
                orderSummaryGobtn: action.payload,
                listBtnLoading: false
            }

        case ORDER_SUMMARY_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };


        default:
            return state
    }
}

export default OrderSummaryReducer  