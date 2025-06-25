import {
    DELETE_PHONE_PAY_SETTING_LIST_ID,
    DELETE_PHONE_PAY_SETTING_LIST_ID_SUCCESS,
    EDIT_PHONE_PAY_SETTING_ID,
    EDIT_PHONE_PAY_SETTING_ID_SUCCESS,
    SAVE_PHONE_PAY_SETTING,
    SAVE_PHONE_PAY_SETTING_SUCCESS,
    PHONE_PAY_SETTING_API_ERROR_ACTION,
    UPDATE_PHONE_PAY_SETTING_ID,
    UPDATE_PHONE_PAY_SETTING_ID_SUCCESS,
    GET_PHONE_PAY_SETTING_LIST_ID_SUCCESS,
    GET_PHONE_PAY_SETTING_LIST_ID,
  
  } from "./actionType";
  
  
  export const savePhonePaySettingMaster = (config = {}) => ({// save Action
    type: SAVE_PHONE_PAY_SETTING,
    config,
  });
  
  export const getPhonePaySettingID = (config = {}) => ({ // get Action 
    type: GET_PHONE_PAY_SETTING_LIST_ID,
    config,
    
  });

  export const getPhonePaySettingIDSuccess = (editData) => ({// Edit  Success
    type: GET_PHONE_PAY_SETTING_LIST_ID_SUCCESS,
    payload: editData,
  });

  
  
  export const savePhonePaySettingMaster_Success = (resp) => ({// Save  success
    type: SAVE_PHONE_PAY_SETTING_SUCCESS,
    payload: resp,
  });
  
  export const editPhonePaySettingID = (config = {}) => ({ // Edit Action 
    type: EDIT_PHONE_PAY_SETTING_ID,
    config,
  });
  
  export const editPhonePaySettingIDSuccess = (editData) => ({// Edit  Success
    type: EDIT_PHONE_PAY_SETTING_ID_SUCCESS,
    payload: editData,
  });
  
  export const updatePhonePaySettingID = (config = {}) => ({// update  Action
    type: UPDATE_PHONE_PAY_SETTING_ID,
    config,
  });
  
  export const updatePhonePaySettingIDSuccess = (resp) => ({ //Update Success
    type: UPDATE_PHONE_PAY_SETTING_ID_SUCCESS,
    payload: resp,
  })
  
  export const delete_PhonePaySetting_ID = (config = {}) => ({// Delete  Action
    type: DELETE_PHONE_PAY_SETTING_LIST_ID,
    config,
  });
  
  export const deletePhonePaySettingSuccess = (resp) => ({// Delete Success
    type: DELETE_PHONE_PAY_SETTING_LIST_ID_SUCCESS,
    payload: resp
  });
  
  
  export const PhonePaySettingApiErrorAction = () => ({
    type: PHONE_PAY_SETTING_API_ERROR_ACTION,
  });
  
  
  
  
  