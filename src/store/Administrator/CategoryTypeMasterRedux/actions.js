
import {POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API,
  POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API_SUCCESS,
  DELETE_CATEGORY_TYPE_ID,
  DELETE_CATEGORY_TYPE_ID_SUCCESS,
  EDIT_CATEGORY_TYPE_ID,
  EDIT_CATEGORY_TYPE_ID_SUCCESS,
  GET_CATEGORY_TYPE_LIST,
  GET_CATEGORY_TYPE_LIST_SUCCESS,
  UPDATE_CATEGORY_TYPE_ID,
  UPDATE_CATEGORY_TYPE_ID_SUCCESS
  
  } from "./actionTypes";

export const PostMethodForCategoryTypeMaster = (data) => ({
    type: POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API,
    data,
  });
  
  export const PostMethod_ForCategoryTypeMasterAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API_SUCCESS,
    payload: data,
  });


/// get Product Category Type list 
export const getCategoryTypelist = () => ({
  type: GET_CATEGORY_TYPE_LIST,
});

export const getCategoryTypelistSuccess = (pages) => ({
  type: GET_CATEGORY_TYPE_LIST_SUCCESS,
  payload: pages,
});

////delete api
export const delete_CategoryType_ID = (id) => ({
  type: DELETE_CATEGORY_TYPE_ID,
  id,

});
export const deleteCategoryTypeIDSuccess = (deleteMessage) => ({
  type: DELETE_CATEGORY_TYPE_ID_SUCCESS,
  payload: deleteMessage
}); 

// edit api
export const editCategoryTypeID = (id) => ({
  type: EDIT_CATEGORY_TYPE_ID,
  id,
})
export const editCategoryTypeIDSuccess = (editData) => ({
  type: EDIT_CATEGORY_TYPE_ID_SUCCESS,
  payload: editData,
})

// update api
export const updateCategoryTypeID = (updateData, ID) => ({
  type: UPDATE_CATEGORY_TYPE_ID,
  updateData, ID,
})
export const updateCategoryTypeIDSuccess = (updateMessage) => ({
  type: UPDATE_CATEGORY_TYPE_ID_SUCCESS,
  payload: updateMessage,
})