import {
    SWIGGY_ZOMATO_CLAIM_ACTION,
    SWIGGY_ZOMATO_CLAIM_ACTION_SUCCESS,
    SWIGGY_ZOMATO_CLAIM_ERROR_ACTION
} from "./actionType";

// Trigger saga or middleware to fetch claim data
export const SwiggyZomatoClaim_Action = (config) => ({
    type: SWIGGY_ZOMATO_CLAIM_ACTION,
    config
});

// Action dispatched on successful fetch
export const SwiggyZomatoClaim_Action_Success = (resp) => ({
    type: SWIGGY_ZOMATO_CLAIM_ACTION_SUCCESS,
    payload: resp
});

// Action dispatched on error
export const SwiggyZomatoClaim_ErrorAction = (resp) => ({
    type: SWIGGY_ZOMATO_CLAIM_ERROR_ACTION,
    payload: resp
});
