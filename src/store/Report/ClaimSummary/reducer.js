import { DELETE_CLAIM_ID, DELETE_CLAIM_ID_SUCCESS, POST_CLAIM_CREATE_SUMMARY_API, POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION, POST_CLAIM_CREATE_SUMMARY_API_SUCCESS, POST_ORDER_SUMMARY_API, POST_ORDER_SUMMARY_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    ClaimSummaryGobtn: [],
    CreateClaimLoading: false,
    deleteMsg: { Status: false },
    DeleteBtnLoading: false

}

const ClaimSummaryReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case POST_CLAIM_CREATE_SUMMARY_API:
            return {
                ...state,
                CreateClaimLoading: action.config.btnId
            }

        case POST_CLAIM_CREATE_SUMMARY_API_SUCCESS:
            return {
                ...state,
                ClaimSummaryGobtn: action.payload,
                CreateClaimLoading: false
            }

        case DELETE_CLAIM_ID:
            return {
                ...state,
                DeleteBtnLoading: action.config.btnId
            };


        case DELETE_CLAIM_ID_SUCCESS:
            return {
                ...state,
                DeleteBtnLoading: false,
                deleteMsg: action.payload,
            };

        case POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION:
            return {
                ...state,
                DeleteBtnLoading: false,
                CreateClaimLoading: false
            };


        default:
            return state
    }
}

export default ClaimSummaryReducer;