
import {
  POST_METHOD_FOR_GENERAL_API,
  POST_METHOD_FOR_GENERAL_API_SUCCESS,
  DELETE_GENERAL_ID,
  DELETE_GENERAL_ID_SUCCESS,
  EDIT_GENERAL_ID,
  EDIT_GENERAL_ID_SUCCESS,
  POST_GENERAL_LIST,
  POST_GENERAL_LIST_SUCCESS,
  UPDATE_GENERAL_ID,
  UPDATE_GENERAL_ID_SUCCESS,
  POST_TYPE,
  POST_TYPE_SUCCESS,
  GENERAL_MASTER_SUB_TYPE,
  GENERAL_MASTER_SUB_TYPE_SUCCESS,
} from "./actionType";

export const PostMethodForGeneral = (data) => ({
  type: POST_METHOD_FOR_GENERAL_API,
  data,
});

export const PostMethodForGeneralSuccess = (data) => ({
  type: POST_METHOD_FOR_GENERAL_API_SUCCESS,
  payload: data,
});

/// get General list 
export const PostGenerallist = (data) => ({
  type: POST_GENERAL_LIST,
  data
});

export const PostGenerallistSuccess = (data) => ({
  type: POST_GENERAL_LIST_SUCCESS,
  payload: data,
});

//delete api
export const delete_General_ID = (id) => ({
  type: DELETE_GENERAL_ID,
  id,

});

export const deleteGeneralIDSuccess = (deleteMessage) => ({
  type: DELETE_GENERAL_ID_SUCCESS,
  payload: deleteMessage
});

// edit api

export const editGeneralID = (id, pageMode) => ({
  type: EDIT_GENERAL_ID,
  id, pageMode
})

export const editGeneralIDSuccess = (editData) => ({
  type: EDIT_GENERAL_ID_SUCCESS,
  payload: editData,
})

// update api
export const updateGeneralID = (updateData, ID) => ({
  type: UPDATE_GENERAL_ID,
  updateData, ID,
})

export const updateGeneralIDSuccess = (updateMessage) => ({
  type: UPDATE_GENERAL_ID_SUCCESS,
  payload: updateMessage,
})

/// Type dropdown
export const PostType = (data) => ({
  type: POST_TYPE,
  data,
});
export const PostTypeSuccess = (data) => ({
  type: POST_TYPE_SUCCESS,
  payload: data,

});

// post api for Brand Name dropdown
export const GeneralMasterSubType = (data) => ({
  type: GENERAL_MASTER_SUB_TYPE,
  data,
});

export const GeneralMasterSubType_Success = (data) => ({
  type: GENERAL_MASTER_SUB_TYPE_SUCCESS,
  payload: data,
});