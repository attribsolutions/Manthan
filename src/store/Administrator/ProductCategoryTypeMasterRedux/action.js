
import {POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API,
  POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API_SUCCESS,
  DELETE_PRODUCT_CATEGORY_TYPE_ID,
  DELETE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS,
  EDIT_PRODUCT_CATEGORY_TYPE_ID,
  EDIT_PRODUCT_CATEGORY_TYPE_ID_SUCCESS,
  GET_PRODUCT_CATEGORY_TYPE_LIST,
  GET_PRODUCT_CATEGORY_TYPE_LIST_SUCCESS,
  UPDATE_PRODUCT_CATEGORY_TYPE_ID,
  UPDATE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS
  
  } from "./actionTypes";

export const PostMethodForProductCategoryTypeMaster = (data) => ({
    type: POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API,
    data,
  });
  
  export const PostMethod_ForProductCategoryTypeMasterAPISuccess = (data) => ({
    type: POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API_SUCCESS,
    payload: data,
  });


/// get Product Category Type list 
export const getProductCategoryTypelist = () => ({
  type: GET_PRODUCT_CATEGORY_TYPE_LIST,
});

export const getProductCategoryTypelistSuccess = (pages) => ({
  type: GET_PRODUCT_CATEGORY_TYPE_LIST_SUCCESS,
  payload: pages,
});

////delete api
export const delete_ProductCategoryType_ID = (id) => ({
  type: DELETE_PRODUCT_CATEGORY_TYPE_ID,
  id,

});
export const deleteProductCategoryTypeIDSuccess = (deleteMessage) => ({
  type: DELETE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS,
  payload: deleteMessage
}); 

// edit api
export const editProductCategoryTypeID = (id) => ({
  type: EDIT_PRODUCT_CATEGORY_TYPE_ID,
  id,
})
export const editProductCategoryTypeIDSuccess = (editData) => ({
  type: EDIT_PRODUCT_CATEGORY_TYPE_ID_SUCCESS,
  payload: editData,
})

// update api
export const updateProductCategoryTypeID = (updateData, ID) => ({
  type: UPDATE_PRODUCT_CATEGORY_TYPE_ID,
  updateData, ID,
})
export const updateProductCategoryTypeIDSuccess = (updateMessage) => ({
  type: UPDATE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS,
  payload: updateMessage,
})