import { GET_PARTY_SETTING_API, GET_PARTY_SETTING_API_ERROR_ACTION, GET_PARTY_SETTING_API_SUCCESS, SAVE_PARTY_SETTING_MASTER, SAVE_PARTY_SETTING_MASTER_SUCCESS } from "./actionType";


export const savePartySetting = (config = {}) => ({// save Action
    type: SAVE_PARTY_SETTING_MASTER,
    config,
});

export const savePartySettingMaster_Success = (resp) => ({// Save  success
    type: SAVE_PARTY_SETTING_MASTER_SUCCESS,
    payload: resp,
});


debugger
export const getpartysetting_API = (config = {}) => ({ // save Action

    type: GET_PARTY_SETTING_API,
    config,
});

export const getpartysetting_API_Success = (resp) => ({ // Save  success
    type: GET_PARTY_SETTING_API_SUCCESS,
    payload: resp,
});


export const getpartysettingApiErrorAction = () => ({
    type: GET_PARTY_SETTING_API_ERROR_ACTION,
})
