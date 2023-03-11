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
  UPDATE_MODULE_ID_SUCCESS
} from "./actionType";

export const saveModuleMaster = (data) => ({
  type: SAVE_MODULE_MASTER,
  data,
});

export const saveModuleMasterSuccess = (modulesSubmitSuccesss) => ({
  type: SAVE_MODULE_MASTER_SUCCESS,
  payload: modulesSubmitSuccesss,
});

export const saveModuleMasterError = (modulesSubmitError) => ({
  type: POST_MODULES_SUBMIT_ERROR,
  payload: modulesSubmitError,
});

export const getModuleList = () => ({
  type: FETCH_MODULES_LIST,
});
export const getModuleListSuccess = (modulesList) => ({
  type: FETCH_MODULES_LIST_SUCCESS,
  payload: modulesList,
});

export const getModuleListError = (modulesListError) => ({
  type: FETCH_MODULES_LIST_ERROR,
  payload: modulesListError,
});

export const deleteModuleID = (id) => ({
  type: DELETE_MODULE_ID,
  id,
});
export const deleteModuleIDSuccess = (deleteModuleIDSuccess) => ({
  type: DELETE_MODULE_ID_SUCCESS,
  payload: deleteModuleIDSuccess,
});
export const deleteModuleIDError = (deleteModuleIDError) => ({
  type: DELETE_MODULE_ID_ERROR,
  payload: deleteModuleIDError,
});

export const editModuleID = (id,pageMode) => ({
  type: EDIT_MODULE_ID,
  id,pageMode
});
export const editModuleIDSuccess = (editData) => ({
  type: EDIT_MODULE_ID_SUCCESS,
  payload: editData,
});

export const updateModuleID = (data,id) => ({
  type: UPDATE_MODULE_ID,
  data,id,
});
export const updateModuleIDSuccess = (updateMessage) => ({
  type: UPDATE_MODULE_ID_SUCCESS,
  payload: updateMessage,
});