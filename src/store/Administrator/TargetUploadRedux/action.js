import {

  DELETE_TARGET_UPLOAD_LIST_ID,
  DELETE_TARGET_UPLOAD_LIST_ID_SUCCESS,
  EDIT_TARGET_UPLOAD_ID,
  EDIT_TARGET_UPLOAD_ID_SUCCESS,
  GET_TARGET_UPLOAD_LIST,
  GET_TARGET_UPLOAD_LIST_SUCCESS,
  SAVE_TARGET_UPLOAD_MASTER,
  SAVE_TARGET_UPLOAD_MASTER_SUCCESS,
  TARGET_UPLOAD_API_ERROR_ACTION,
} from "./actionType";


export const getTargetUploadList = () => ({// get List Action
  type: GET_TARGET_UPLOAD_LIST,
});

export const getTargetUploadListSuccess = (pages) => ({// get List success
  type: GET_TARGET_UPLOAD_LIST_SUCCESS,
  payload: pages,
});

export const saveTargetUploadMaster = (config = {}) => ({// save Action
  type: SAVE_TARGET_UPLOAD_MASTER,
  config,
});

export const saveTargetUploadMaster_Success = (resp) => ({// Save  success
  type: SAVE_TARGET_UPLOAD_MASTER_SUCCESS,
  payload: resp,
});


export const editTargetUploadID = (config = {}) => ({ // Edit Action 
  type: EDIT_TARGET_UPLOAD_ID,
  config,
});

export const editTargetUploadIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_TARGET_UPLOAD_ID_SUCCESS,
  payload: editData,
});

export const delete_TargetUpload_ID = (config = {}) => ({// Delete  Action
  type: DELETE_TARGET_UPLOAD_LIST_ID,
  config,
});

export const deleteTargetUploadSuccess = (resp) => ({// Delete Success
  type: DELETE_TARGET_UPLOAD_LIST_ID_SUCCESS,
  payload: resp
});

export const TargetUploadApiErrorAction = () => ({
  type: TARGET_UPLOAD_API_ERROR_ACTION,
});




