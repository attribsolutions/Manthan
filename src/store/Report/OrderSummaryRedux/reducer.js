import { ORDER_SUMMARY_API_ERROR_ACTION, POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    orderSummaryGobtn: { Status: false },
    goBtnLoading: false,
}

const OrderSummaryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {


        case POST_ORDER_SUMMARY_API:
            return {
                ...state,
                goBtnLoading: true
                ,
            }

        case POST_ORDER_SUMMARY_API_SUCCESS:
            return {
                ...state,
                goBtnLoading: false,
                orderSummaryGobtn: action.payload,
            };

        case ORDER_SUMMARY_API_ERROR_ACTION:
            return {
                ...state,
                goBtnLoading: false,
            }

        default:
            return state
    }
}

export default OrderSummaryReducer  