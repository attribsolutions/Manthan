import {
    CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
    GET_CLAIM_TRACKING_ENTRY_LIST,
    GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS,
    SAVE_CLAIM_TRACKING_ENTRY,
    SAVE_CLAIM_TRACKING_ENTRY_SUCCESS
} from "./actionType";

const INIT_STATE = {

    postMsg: { Status: false },
    claimTrackingEntryList:[],
    saveBtnloading: false,
    loading: false,

}

const ClaimTrackingEntry_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {


        case SAVE_CLAIM_TRACKING_ENTRY:
            return {
                ...state,
                saveBtnloading: true
            }

        case SAVE_CLAIM_TRACKING_ENTRY_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false

            }

        case GET_CLAIM_TRACKING_ENTRY_LIST:
            return {
                ...state,
                loading: true,
            }

        case GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS:
            return {
                ...state,
                claimTrackingEntryList: action.payload,
                loading: false,
            }

        case CLAIM_TRACKING_ENTRY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
            };

        default:
            return state
    }

}

export default ClaimTrackingEntry_Reducer