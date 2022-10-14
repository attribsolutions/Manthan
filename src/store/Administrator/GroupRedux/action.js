
import {
    GET_METHOD_HANDLER_FOR_GROUPMASTER,
    GET_METHOD_HANDLER_FOR_GROUPMASTER_SUCCESS,
    POST_METHOD_HANDLER_FOR_GROUPMASTER_API,
    POST_METHOD_HANDLER_FOR_GROUPMASTER_API_SUCCESS,
    DELETE_GROUPMASTER_ID,
    DELETE_GROUPMASTER_ID_SUCCESS,
    EDIT_GROUPMASTER_ID,
    EDIT_GROUPMASTER_ID_SUCCESS,
    GET_GROUPMASTER_LIST,
    GET_GROUPMASTER_LIST_SUCCESS,
    UPDATE_GROUPMASTER_ID,
    UPDATE_GROUPMASTER_ID_SUCCESS,
    
  } from "./actionTypes";
  
  export const PostMethodForMaster = (data) => ({
    type: POST_METHOD_HANDLER_FOR_GROUPMASTER_API,
    data,
  });
  
  export const PostMethod_ForMasterAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_GROUPMASTER_API_SUCCESS,
    payload: data,
  });
  
  /// get Product Category Type list 
  export const getMasterlist = () => ({
    type: GET_GROUPMASTER_LIST,
  });
  
  export const getMasterlistSuccess = (pages) => ({
    type: GET_GROUPMASTER_LIST_SUCCESS,
    payload: pages,
  });
  
  ////delete api
  export const delete_Master_ID = (id) => ({
    type: DELETE_GROUPMASTER_ID,
    id,
  
  });
  export const deleteMasterIDSuccess = (deleteMessage) => ({
    type: DELETE_GROUPMASTER_ID_SUCCESS,
    payload: deleteMessage
  }); 
  
  // edit api
  
  export const editMasterID = (id,pageMode) => ({
    type: EDIT_GROUPMASTER_ID,
    id,pageMode
  })
  
  export const editMasterIDSuccess = (editData) => ({
    type: EDIT_GROUPMASTER_ID_SUCCESS,
    payload: editData,
  })
  // update api
  export const updateMasterID = (updateData, ID) => ({
    type: UPDATE_GROUPMASTER_ID,
    updateData, ID,
  })
  export const updateMasterIDSuccess = (updateMessage) => ({
    type: UPDATE_GROUPMASTER_ID_SUCCESS,
    payload: updateMessage,
  })
  
  