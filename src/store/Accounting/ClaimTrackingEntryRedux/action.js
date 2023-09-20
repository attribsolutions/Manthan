import {
    CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
    GET_CLAIM_TRACKING_ENTRY_LIST,
    GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS,
    SAVE_CLAIM_TRACKING_ENTRY,
    SAVE_CLAIM_TRACKING_ENTRY_SUCCESS
} from "./actionType";

export const saveClaimTrackingEntry = (config = {}) => ({// save Action
    type: SAVE_CLAIM_TRACKING_ENTRY,
    config,
});

export const saveClaimTrackingEntry_Success = (resp) => ({// Save  success
    type: SAVE_CLAIM_TRACKING_ENTRY_SUCCESS,
    payload: resp,
});


export const getClaimTrackingEntrylist = (config = {}) => ({// get List Action
    type: GET_CLAIM_TRACKING_ENTRY_LIST,
    config
});

export const getClaimTrackingEntrySuccess = (pages) => ({// get List success
    type: GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS,
    payload: pages,
});


export const ClaimTrackingEntryApiErrorAction = () => ({
    type: CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
})