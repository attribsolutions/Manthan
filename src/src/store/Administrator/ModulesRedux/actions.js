import {
  DELETE_MODULE_ID,
  DELETE_MODULE_ID_ERROR,
  DELETE_MODULE_ID_SUCCESS,
  EDIT_MODULE_ID,
  EDIT_MODULE_ID_SUCCESS,
  FETCH_MODULES_LIST,
  FETCH_MODULES_LIST_ERROR,
  FETCH_MODULES_LIST_SUCCESS,
  POST_MODULES_SUBMIT,
  POST_MODULES_SUBMIT_ERROR,
  POST_MODULES_SUBMIT_SUCCESS,
  UPDATE_MODULE_ID,
  UPDATE_MODULE_ID_SUCCESS
} from "./actionType";


export const PostModelsSubmit = (data) => ({
  type: POST_MODULES_SUBMIT,
  data,
});

export const PostModelsSubmitSuccess = (modulesSubmitSuccesss) => ({
  type: POST_MODULES_SUBMIT_SUCCESS,
  payload: modulesSubmitSuccesss,
});

export const PostModelsSubmitError = (modulesSubmitError) => ({
  type: POST_MODULES_SUBMIT_ERROR,
  payload: modulesSubmitError,
});

// Fetch Modules get Data Actions 
export const fetchModelsList = () => ({
  type: FETCH_MODULES_LIST,
});
export const fetchModelsListSuccess = (modulesList) => ({
  type: FETCH_MODULES_LIST_SUCCESS,
  payload: modulesList,
});
export const fetchModelsListError = (modulesListError) => ({
  type: FETCH_MODULES_LIST_ERROR,
  payload: modulesListError,
});

// Delete Module ID Actions
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


//Edit Modules Using Id
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