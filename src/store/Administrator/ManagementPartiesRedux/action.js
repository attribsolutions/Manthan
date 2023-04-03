import {
    SAVE_MANAGEMENT_PARTIES,
    SAVE_MANAGEMENT_PARTIES_SUCCESS
} from "./actionType";

export const saveManagementParties = (config = {}) => ({// save Action
    type: SAVE_MANAGEMENT_PARTIES,
    config,
});

export const saveManagementParties_Success = (resp) => ({// Save  success
    type: SAVE_MANAGEMENT_PARTIES_SUCCESS,
    payload: resp,
});
