import { POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    orderSummaryGobtn: [],
}

const OrderSummaryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {


        case POST_ORDER_SUMMARY_API_SUCCESS:
            return {
                ...state,
                orderSummaryGobtn: action.payload,
            }

        default:
            return state
    }
}

export default OrderSummaryReducer  