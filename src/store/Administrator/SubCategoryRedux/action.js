
import {
    GET_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,
    GET_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API_SUCCESS,
    POST_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,
    POST_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API_SUCCESS,
    DELETE_SUBCATEGORY_ID,
    DELETE_SUBCATEGORY_ID_SUCCESS,
    EDIT_SUBCATEGORY_ID,
    EDIT_SUBCATEGORY_ID_SUCCESS,
    GET_SUBCATEGORY_LIST,
    GET_SUBCATEGORY_LIST_SUCCESS,
    UPDATE_SUBCATEGORY_ID,
    UPDATE_SUBCATEGORY_ID_SUCCESS,
    
  } from "./actionTypes";
  
  export const PostMethodForSubCategoryMaster= (data) => ({
    type: POST_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,
    data,
  });
  
  export const PostMethod_ForSubCategoryMasterAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API_SUCCESS,
    payload: data,
  });
  
  export const getMethodForSubCategoryMaster= () => ({
    type: GET_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,
    
  });
  
  export const getMethod_ForSubCategoryMasterAPISuccess = (ProductTypes) => ({
    type: GET_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API_SUCCESS,
    payload: ProductTypes,
  });
  
  /// get Product Category Type list 
  export const getSubCategorylist = () => ({
    type: GET_SUBCATEGORY_LIST,
  });
  
  export const getSubCategorylistSuccess = (pages) => ({
    type: GET_SUBCATEGORY_LIST_SUCCESS,
    payload: pages,
  });
  
  ////delete api
  export const delete_SubCategory_ID = (id) => ({
    type: DELETE_SUBCATEGORY_ID,
    id,
  
  });
  export const deleteSubCategoryIDSuccess = (deleteMessage) => ({
    type: DELETE_SUBCATEGORY_ID_SUCCESS,
    payload: deleteMessage
  }); 
  
  // edit api
  
  export const editSubCategoryID = (id) => ({
    type: EDIT_SUBCATEGORY_ID,
    id,
  })
  
  export const editSubCategoryIDSuccess = (editData) => ({
    type: EDIT_SUBCATEGORY_ID_SUCCESS,
    payload: editData,
  })
  // update api
  export const updateSubCategoryID = (updateData, ID) => ({
    type: UPDATE_SUBCATEGORY_ID,
    updateData, ID,
  })
  export const updateSubCategoryIDSuccess = (updateMessage) => ({
    type: UPDATE_SUBCATEGORY_ID_SUCCESS,
    payload: updateMessage,
  })
  
  