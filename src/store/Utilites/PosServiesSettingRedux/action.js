import {
    DELETE_POS_SERVICE_SETTING_LIST_ID,
    DELETE_POS_SERVICE_SETTING_LIST_ID_SUCCESS,
    EDIT_POS_SERVICE_SETTING_ID,
    EDIT_POS_SERVICE_SETTING_ID_SUCCESS,
    SAVE_POS_SERVICE_SETTING,
    SAVE_POS_SERVICE_SETTING_SUCCESS,
    POS_SERVICE_SETTING_API_ERROR_ACTION,
    UPDATE_POS_SERVICE_SETTING_ID,
    UPDATE_POS_SERVICE_SETTING_ID_SUCCESS,
    GET_POS_SERVICE_SETTING_LIST_SUCCESS,
    GET_POS_SERVICE_SETTING_LIST,
  
  } from "./actionType";
  
  
  export const savePosServiceSettingMaster = (config = {}) => ({// save Action
    type: SAVE_POS_SERVICE_SETTING,
    config,
  });
  
  export const getPosServiceSetting = (config = {}) => ({ // get Action 
    type: GET_POS_SERVICE_SETTING_LIST,
    config,
    
  });

  export const getPosServiceSettingSuccess = (editData) => ({// Edit  Success
    type: GET_POS_SERVICE_SETTING_LIST_SUCCESS,
    payload: editData,
  });

  
  
  export const savePosServiceSettingMaster_Success = (resp) => ({// Save  success
    type: SAVE_POS_SERVICE_SETTING_SUCCESS,
    payload: resp,
  });
  
  export const editPosServiceSettingID = (config = {}) => ({ // Edit Action 
    type: EDIT_POS_SERVICE_SETTING_ID,
    config,
  });
  
  export const editPosServiceSettingIDSuccess = (editData) => ({// Edit  Success
    type: EDIT_POS_SERVICE_SETTING_ID_SUCCESS,
    payload: editData,
  });
  
  export const updatePosServiceSettingID = (config = {}) => ({// update  Action
    type: UPDATE_POS_SERVICE_SETTING_ID,
    config,
  });
  
  export const updatePosServiceSettingIDSuccess = (resp) => ({ //Update Success
    type: UPDATE_POS_SERVICE_SETTING_ID_SUCCESS,
    payload: resp,
  })
  
  export const delete_PosServiceSetting_ID = (config = {}) => ({// Delete  Action
    type: DELETE_POS_SERVICE_SETTING_LIST_ID,
    config,
  });
  
  export const deletePosServiceSettingSuccess = (resp) => ({// Delete Success
    type: DELETE_POS_SERVICE_SETTING_LIST_ID_SUCCESS,
    payload: resp
  });
  
  
  export const PosServiceSettingApiErrorAction = () => ({
    type: POS_SERVICE_SETTING_API_ERROR_ACTION,
  });
  
  
  
  
  