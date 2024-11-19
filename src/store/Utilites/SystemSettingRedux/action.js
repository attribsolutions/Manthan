import {
  DELETE_SYSTEM_SETTING_LIST_ID,
  DELETE_SYSTEM_SETTING_LIST_ID_SUCCESS,
  EDIT_SYSTEM_SETTING_ID,
  EDIT_SYSTEM_SETTING_ID_SUCCESS,
  SAVE_SYSTEM_SETTING,
  SAVE_SYSTEM_SETTING_SUCCESS,
  SYSTEM_SETTING_API_ERROR_ACTION,
  UPDATE_SYSTEM_SETTING_ID,
  UPDATE_SYSTEM_SETTING_ID_SUCCESS,

} from "./actionType";


export const saveSystemSettingMaster = (config = {}) => ({// save Action
  type: SAVE_SYSTEM_SETTING,
  config,
});

export const saveSystemSettingMaster_Success = (resp) => ({// Save  success
  type: SAVE_SYSTEM_SETTING_SUCCESS,
  payload: resp,
});

export const editSystemSettingID = (config = {}) => ({ // Edit Action 
  type: EDIT_SYSTEM_SETTING_ID,
  config,
});

export const editSystemSettingIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_SYSTEM_SETTING_ID_SUCCESS,
  payload: editData,
});

export const updateSystemSettingID = (config = {}) => ({// update  Action
  type: UPDATE_SYSTEM_SETTING_ID,
  config,
});

export const updateSystemSettingIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_SYSTEM_SETTING_ID_SUCCESS,
  payload: resp,
})

export const delete_SystemSetting_ID = (config = {}) => ({// Delete  Action
  type: DELETE_SYSTEM_SETTING_LIST_ID,
  config,
});

export const deleteSystemSettingSuccess = (resp) => ({// Delete Success
  type: DELETE_SYSTEM_SETTING_LIST_ID_SUCCESS,
  payload: resp
});


export const SystemSettingApiErrorAction = () => ({
  type: SYSTEM_SETTING_API_ERROR_ACTION,
});




