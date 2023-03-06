
import {
    POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API,
    POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API_SUCCESS,
    DELETE_ROUTES_ID,
    DELETE_ROUTES_ID_SUCCESS,
    EDIT_ROUTES_ID,
    EDIT_ROUTES_ID_SUCCESS,
    POST_ROUTES_LIST,
    POST_ROUTES_LIST_SUCCESS,
    UPDATE_ROUTES_ID,
    UPDATE_ROUTES_ID_SUCCESS 
    } from "./actionTypes";
  
  export const PostMethodForRoutesMaster = (data) => ({
      type: POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API,
      data,
    });
    
    export const PostMethod_ForRoutesMasterAPISuccess = (data) => ({
      type: POST_METHOD_HANDLER_FOR_ROUTES_MASTER_API_SUCCESS,
      payload: data,
    });
  
  
  ///  list 
  export const PostRouteslist = (jsonBody) => ({
    type: POST_ROUTES_LIST,
    jsonBody,
  });
  
  export const PostRouteslistSuccess = (data) => ({
    type: POST_ROUTES_LIST_SUCCESS,
    payload: data,
  });
  
  ////delete api
  export const delete_Routes_ID = (id) => ({
    type: DELETE_ROUTES_ID,
    id,
  
  });
  export const deleteRoutesIDSuccess = (deleteMessage) => ({
    type: DELETE_ROUTES_ID_SUCCESS,
    payload: deleteMessage
  }); 
  
  // edit api
  
  export const editRoutesID = (id,pageMode) => ({
    type: EDIT_ROUTES_ID,
    id,pageMode
  })
  
  export const editRoutesIDSuccess = (editData) => ({
    type: EDIT_ROUTES_ID_SUCCESS,
    payload: editData,
  })
  // update api
  export const updateRoutesID = (updateData, ID) => ({
    type: UPDATE_ROUTES_ID,
    updateData, ID,
  })
  export const updateRoutesIDSuccess = (updateMessage) => ({
    type: UPDATE_ROUTES_ID_SUCCESS,
    payload: updateMessage,
  })