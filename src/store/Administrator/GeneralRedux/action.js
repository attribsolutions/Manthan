
import {
    POST_METHOD_FOR_GENERAL_API,
    POST_METHOD_FOR_GENERAL_API_SUCCESS,
    DELETE_GENERAL_ID,
    DELETE_GENERAL_ID_SUCCESS,
    EDIT_GENERAL_ID,
    EDIT_GENERAL_ID_SUCCESS,
    GET_GENERAL_LIST,
    GET_GENERAL_LIST_SUCCESS,
    UPDATE_GENERAL_ID,
    UPDATE_GENERAL_ID_SUCCESS,
    GET_TYPE,
    GET_TYPE_SUCCESS,
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
  export const getGenerallist = () => ({
    type: GET_GENERAL_LIST,
  });
  
  export const getGenerallistSuccess = (pages) => ({
    type: GET_GENERAL_LIST_SUCCESS,
    payload: pages,
  });
  
  ////delete api
  export const delete_General_ID = (id) => ({
    type: DELETE_GENERAL_ID,
    id,
  
  });
  export const deleteGeneralIDSuccess = (deleteMessage) => ({
    type: DELETE_GENERAL_ID_SUCCESS,
    payload: deleteMessage
  }); 
  
  // edit api
  
  export const editGeneralID = (id,pageMode) => ({
    type: EDIT_GENERAL_ID,
    id,pageMode
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
export const getType = () => ({
    type: GET_TYPE,
   
  });
  export const getTypeSuccess = (Type) => ({
    type: GET_TYPE_SUCCESS,
    payload:Type,
  });  