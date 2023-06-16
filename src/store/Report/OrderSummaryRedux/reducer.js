import { ORDER_SUMMARY_API_ERROR_ACTION, POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    orderSummaryGobtn: [],
    listLoading: false
}

const OrderSummaryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_ORDER_SUMMARY_API:
            return {
                ...state,
                listLoading: true
            }

        case POST_ORDER_SUMMARY_API_SUCCESS:
            return {
                ...state,
                orderSummaryGobtn: action.payload,
                listLoading: false

            }

        case ORDER_SUMMARY_API_ERROR_ACTION:
            return {
                ...state,
                listLoading: false,
            };


        default:
            return state
    }
}

export default OrderSummaryReducer  