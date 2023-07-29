import { ORDER_SUMMARY_API_ERROR_ACTION, POST_CLAIM_CREATE_SUMMARY_API, POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION, POST_CLAIM_CREATE_SUMMARY_API_SUCCESS, POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    ClaimSummaryGobtn: [],
    listBtnLoading: false
}

const ClaimSummaryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_CLAIM_CREATE_SUMMARY_API:
            return {
                ...state,
                listBtnLoading: true
            }

        case POST_CLAIM_CREATE_SUMMARY_API_SUCCESS:
            return {
                ...state,
                ClaimSummaryGobtn: action.payload,
                listBtnLoading: false
            }

        case POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
            };


        default:
            return state
    }
}

export default ClaimSummaryReducer  ;