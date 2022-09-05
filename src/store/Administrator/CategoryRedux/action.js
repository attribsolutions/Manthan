
import {
  GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
  GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
  POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
  POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
  DELETE_PRODUCT_TYPES_ID,
  DELETE_PRODUCT_TYPES_ID_SUCCESS,
  EDIT_PRODUCT_TYPES_ID,
  EDIT_PRODUCT_TYPES_ID_SUCCESS,
  GET_PRODUCT_TYPES_LIST,
  GET_PRODUCT_TYPES_LIST_SUCCESS,
  UPDATE_PRODUCT_TYPES_ID,
  UPDATE_PRODUCT_TYPES_ID_SUCCESS,
  
} from "./actionTypes";

export const PostMethodForProductTypes = (data) => ({
  type: POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
  data,
});

export const PostMethod_ForProductTypesAPISuccess = (data) => ({
  type: POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
  payload: data,
});

export const getMethodForProductTypes = () => ({
  type: GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
  
});

export const getMethod_ForProductTypesAPISuccess = (ProductTypes) => ({
  type: GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
  payload: ProductTypes,
});

/// get Product Category Type list 
export const getProductTypeslist = () => ({
  type: GET_PRODUCT_TYPES_LIST,
});

export const getProductTypeslistSuccess = (pages) => ({
  type: GET_PRODUCT_TYPES_LIST_SUCCESS,
  payload: pages,
});

////delete api
export const delete_ProductTypes_ID = (id) => ({
  type: DELETE_PRODUCT_TYPES_ID,
  id,

});
export const deleteProductTypesIDSuccess = (deleteMessage) => ({
  type: DELETE_PRODUCT_TYPES_ID_SUCCESS,
  payload: deleteMessage
}); 

// edit api

export const editProductTypesID = (id,pageMode) => ({
  type: EDIT_PRODUCT_TYPES_ID,
  id,pageMode
})

export const editProductTypesIDSuccess = (editData) => ({
  type: EDIT_PRODUCT_TYPES_ID_SUCCESS,
  payload: editData,
})
// update api
export const updateProductTypesID = (updateData, ID) => ({
  type: UPDATE_PRODUCT_TYPES_ID,
  updateData, ID,
})
export const updateProductTypesIDSuccess = (updateMessage) => ({
  type: UPDATE_PRODUCT_TYPES_ID_SUCCESS,
  payload: updateMessage,
})

