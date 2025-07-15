import {
    SWIGGY_ZOMATO_CLAIM_ACTION,
    SWIGGY_ZOMATO_CLAIM_ACTION_SUCCESS,
    SWIGGY_ZOMATO_CLAIM_ERROR_ACTION
} from "./actionType";

// Initial state
const INIT_STATE = {
    SwiggyZomatoClaimData: [],
    listBtnLoading: false
};

// Reducer
const SwiggyZomatoClaimReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // Start fetching claim data
        case SWIGGY_ZOMATO_CLAIM_ACTION:
            return {
                ...state,
                listBtnLoading: true
            };

        // Successfully received claim data
        case SWIGGY_ZOMATO_CLAIM_ACTION_SUCCESS:
            return {
                ...state,
                SwiggyZomatoClaimData: action.payload,
                listBtnLoading: false
            };

        // Error occurred during fetch
        case SWIGGY_ZOMATO_CLAIM_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false
            };

        default:
            return state;
    }
};

export default SwiggyZomatoClaimReducer;
