import {
    CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
    DELETE_CLAIM_TRACKING_ENTRY_ID,
    DELETE_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    EDIT_CLAIM_TRACKING_ENTRY_ID,
    EDIT_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    GET_CLAIM_TRACKING_ENTRY_LIST,
    GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS,
    SAVE_CLAIM_TRACKING_ENTRY,
    SAVE_CLAIM_TRACKING_ENTRY_SUCCESS,
    UPDATE_CLAIM_TRACKING_ENTRY_ID,
    UPDATE_CLAIM_TRACKING_ENTRY_ID_SUCCESS
} from "./actionType";

export const getClaimTrackingEntrylist = (config = {}) => ({// get List Action
    type: GET_CLAIM_TRACKING_ENTRY_LIST,
    config
});

export const getClaimTrackingEntrySuccess = (pages) => ({// get List success
    type: GET_CLAIM_TRACKING_ENTRY_LIST_SUCCESS,
    payload: pages,
});

export const saveClaimTrackingEntry = (config = {}) => ({// save Action
    type: SAVE_CLAIM_TRACKING_ENTRY,
    config,
});

export const saveClaimTrackingEntry_Success = (resp) => ({// Save  success
    type: SAVE_CLAIM_TRACKING_ENTRY_SUCCESS,
    payload: resp,
});

export const editClaimTrackingEntryID = (config = {}) => ({ // Edit Action 
    type: EDIT_CLAIM_TRACKING_ENTRY_ID,
    config,
});

export const editClaimTrackingEntryIDSuccess = (editData) => ({// Edit  Success
    type: EDIT_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    payload: editData,
});

export const updateClaimTrackingEntryID = (config = {}) => ({// update  Action
    type: UPDATE_CLAIM_TRACKING_ENTRY_ID,
    config,
});

export const updateClaimTrackingEntryIDSuccess = (resp) => ({ //Update Success
    type: UPDATE_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    payload: resp,
})

export const delete_ClaimTrackingEntry_ID = (config = {}) => ({// Delete  Action
    type: DELETE_CLAIM_TRACKING_ENTRY_ID,
    config,
});

export const delete_ClaimTrackingEntryID_Success = (resp) => ({// Delete Success
    type: DELETE_CLAIM_TRACKING_ENTRY_ID_SUCCESS,
    payload: resp
});

// Claim Tracking Entry Error action
export const ClaimTrackingEntryApiErrorAction = () => ({
    type: CLAIM_TRACKING_ENTRY_API_ERROR_ACTION,
})
