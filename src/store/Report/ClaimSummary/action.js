import { CLAIM_LIST_API, CLAIM_LIST_API_SUCCESS, DELETE_CLAIM_ID, DELETE_CLAIM_ID_SUCCESS, POST_CLAIM_CREATE_SUMMARY_API, POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION, POST_CLAIM_CREATE_SUMMARY_API_SUCCESS, } from "./actionType";

export const postClaimMasterCreate_API = (config = {}) => ({ // save Action
    type: POST_CLAIM_CREATE_SUMMARY_API,
    config,
});

export const postMasterClaimCreat_API_Success = (resp) => ({ // Save  success
    type: POST_CLAIM_CREATE_SUMMARY_API_SUCCESS,
    payload: resp,
});

export const claimList_API = (config = {}) => ({ // save Action
    type: CLAIM_LIST_API,
    config,
});

export const claimList_API_Success = (resp) => ({ // Save  success
    type:CLAIM_LIST_API_SUCCESS,
    payload: resp,
});

export const delete_Claim_ID = (config = {}) => ({// Delete  Action
    type: DELETE_CLAIM_ID,
    config,
});

export const deleteClaimSuccess = (resp) => ({// Delete Success
    type: DELETE_CLAIM_ID_SUCCESS,
    payload: resp
});

export const MasterClaimCreatApiErrorAction = () => ({
    type: POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION,
})


