import {
    CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
    SAVE_CLAIM_TRACKING_ENTRY,
    SAVE_CLAIM_TRACKING_ENTRY_SUCCESS
} from "./actionType";

const INIT_STATE = {

    postMsg: { Status: false },

    saveBtnloading: false,

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

        case CLAIM_TRACKING_ENTRY_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
            };

        default:
            return state
    }

}

export default ClaimTrackingEntry_Reducer