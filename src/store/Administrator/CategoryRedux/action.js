
import {
  GET_METHOD_HANDLER_FOR_CATEGORY,
  GET_METHOD_HANDLER_FOR_CATEGORY_SUCCESS,
  POST_METHOD_HANDLER_FOR_CATEGORY_API,
  POST_METHOD_HANDLER_FOR_CATEGORY_API_SUCCESS,
  DELETE_CATEGORY_ID,
  DELETE_CATEGORY_ID_SUCCESS,
  EDIT_CATEGORY_ID,
  EDIT_CATEGORY_ID_SUCCESS,
  GET_CATEGORY_LIST,
  GET_CATEGORY_LIST_SUCCESS,
  UPDATE_CATEGORY_ID,
  UPDATE_CATEGORY_ID_SUCCESS,
  
} from "./actionTypes";

export const PostMethodForCategory = (data) => ({
  type: POST_METHOD_HANDLER_FOR_CATEGORY_API,
  data,
});

export const PostMethod_ForCategoryAPISuccess = (data) => ({
  type: POST_METHOD_HANDLER_FOR_CATEGORY_API_SUCCESS,
  payload: data,
});

export const getMethodForCategory  = () => ({
  type: GET_METHOD_HANDLER_FOR_CATEGORY,
  
});

export const getMethod_ForCategoryAPISuccess = (Category) => ({
  type: GET_METHOD_HANDLER_FOR_CATEGORY_SUCCESS,
  payload: Category,
});

/// get Product Category Type list 
export const getCategorylist = () => ({
  type: GET_CATEGORY_LIST,
});

export const getCategorylistSuccess = (pages) => ({
  type: GET_CATEGORY_LIST_SUCCESS,
  payload: pages,
});

////delete api
export const delete_Category_ID = (id) => ({
  type: DELETE_CATEGORY_ID,
  id,

});
export const deleteCategoryIDSuccess = (deleteMessage) => ({
  type: DELETE_CATEGORY_ID_SUCCESS,
  payload: deleteMessage
}); 

// edit api

export const editCategoryID = (id,pageMode) => ({
  type: EDIT_CATEGORY_ID,
  id,pageMode
})

export const editCategoryIDSuccess = (editData) => ({
  type: EDIT_CATEGORY_ID_SUCCESS,
  payload: editData,
})
// update api
export const updateCategoryID = (updateData, ID) => ({
  type: UPDATE_CATEGORY_ID,
  updateData, ID,
})
export const updateCategoryIDSuccess = (updateMessage) => ({
  type: UPDATE_CATEGORY_ID_SUCCESS,
  payload: updateMessage,
})

