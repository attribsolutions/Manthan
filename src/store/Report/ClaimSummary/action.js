import { POST_CLAIM_CREATE_SUMMARY_API, POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION, POST_CLAIM_CREATE_SUMMARY_API_SUCCESS, } from "./actionType";

export const postClaimMasterCreate_API = (config = {}) => ({ // save Action
    type: POST_CLAIM_CREATE_SUMMARY_API,
    config,
});

export const postMasterClaimCreat_API_Success = (resp) => ({ // Save  success
    type: POST_CLAIM_CREATE_SUMMARY_API_SUCCESS,
    payload: resp,
});

export const MasterClaimCreatApiErrorAction = () => ({
    type: POST_CLAIM_CREATE_SUMMARY_API_ERROR_ACTION,
})
