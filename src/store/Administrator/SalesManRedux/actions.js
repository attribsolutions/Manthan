
import {
    POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API,
    POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API_SUCCESS,
    DELETE_SALESMAN_ID,
    DELETE_SALESMAN_ID_SUCCESS,
    EDIT_SALESMAN_ID,
    EDIT_SALESMAN_ID_SUCCESS,
    POST_SALESMAN_LIST,
    POST_SALESMAN_LIST_SUCCESS,
    UPDATE_SALESMAN_ID,
    UPDATE_SALESMAN_ID_SUCCESS 
    } from "./actionTypes";
  
  export const PostMethodForSalesManMaster = (data) => ({
      type: POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API,
      data,
    });
    
    export const PostMethod_ForSalesManMasterAPISuccess = (data) => ({
      type: POST_METHOD_HANDLER_FOR_SALESMAN_MASTER_API_SUCCESS,
      payload: data,
    });
  
  
  ///  list 
  export const PostSalesManlist = (data) => ({
    type: POST_SALESMAN_LIST,
    data,
  });
  
  export const PostSalesManlistSuccess = (data) => ({
    type: POST_SALESMAN_LIST_SUCCESS,
    payload: data,
  });
  
  ////delete api
  export const delete_SalesMan_ID = (id) => ({
    type: DELETE_SALESMAN_ID,
    id,
  
  });
  export const deleteSalesManIDSuccess = (deleteMessage) => ({
    type: DELETE_SALESMAN_ID_SUCCESS,
    payload: deleteMessage
  }); 
  
  // edit api
  
  export const editSalesManID = (id,pageMode) => ({
    type: EDIT_SALESMAN_ID,
    id,pageMode
  })
  
  export const editSalesManIDSuccess = (editData) => ({
    type: EDIT_SALESMAN_ID_SUCCESS,
    payload: editData,
  })
  // update api
  export const updateSalesManID = (updateData, ID) => ({
    type: UPDATE_SALESMAN_ID,
    updateData, ID,
  })
  export const updateSalesManIDSuccess = (updateMessage) => ({
    type: UPDATE_SALESMAN_ID_SUCCESS,
    payload: updateMessage,
  })