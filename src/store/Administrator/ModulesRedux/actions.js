import {
  DELETE_MODULE_ID,
  DELETE_MODULE_ID_ERROR,
  DELETE_MODULE_ID_SUCCESS,
  EDIT_MODULE_ID,
  EDIT_MODULE_ID_SUCCESS,
  FETCH_MODULES_LIST,
  FETCH_MODULES_LIST_ERROR,
  FETCH_MODULES_LIST_SUCCESS,
  SAVE_MODULE_MASTER,
  POST_MODULES_SUBMIT_ERROR,
  SAVE_MODULE_MASTER_SUCCESS,
  UPDATE_MODULE_ID,
  UPDATE_MODULE_ID_SUCCESS,
  MODULE_API_ERROR_ACTION
} from "./actionType";

export const getModuleList = () => ({// get List Action
  type: FETCH_MODULES_LIST,
});
export const getModuleListSuccess = (resp) => ({// get List success
  type: FETCH_MODULES_LIST_SUCCESS,
  payload: resp,
});

export const getModuleListError = (modulesListError) => ({
  type: FETCH_MODULES_LIST_ERROR,
  payload: modulesListError,
});

export const saveModuleMaster = (config = {}) => ({// save Action
  type: SAVE_MODULE_MASTER,
  config,
});

export const saveModuleMasterSuccess = (resp) => ({// Save  success
  type: SAVE_MODULE_MASTER_SUCCESS,
  payload: resp,
});

export const saveModuleMasterError = (modulesSubmitError) => ({
  type: POST_MODULES_SUBMIT_ERROR,
  payload: modulesSubmitError,
});

export const editModuleID = (config = {}) => ({// Edit Action
  type: EDIT_MODULE_ID,
  config,
});

export const editModuleIDSuccess = (resp) => ({// Edit  Success
  type: EDIT_MODULE_ID_SUCCESS,
  payload: resp,
});

export const updateModuleID = (config = {}) => ({// update  Action
  type: UPDATE_MODULE_ID,
  config,
});

export const updateModuleIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_MODULE_ID_SUCCESS,
  payload: resp,
});

export const deleteModuleID = (config = {}) => ({// Delete  Action
  type: DELETE_MODULE_ID,
  config,
});

export const deleteModuleIDSuccess = (resp) => ({// Delete Success
  type: DELETE_MODULE_ID_SUCCESS,
  payload: resp,
});

export const deleteModuleIDError = (deleteModuleIDError) => ({
  type: DELETE_MODULE_ID_ERROR,
  payload: deleteModuleIDError,
});
export const moduleApiErrorAction = () => ({
  type: MODULE_API_ERROR_ACTION,
})
