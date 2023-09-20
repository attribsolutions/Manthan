import {
    CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
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

export const ClaimTrackingEntryApiErrorAction = () => ({
    type: CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
})