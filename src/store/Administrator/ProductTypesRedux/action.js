
import {
  GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
  GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
  POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
  POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
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



