import {
  POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS,
  GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  PostDataMessage: { Status: false },
  ProductTypeAPI: [],
}

const ProductTypesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS:
      return {
        ...state,
        PostDataMessage: action.payload,
      }

    case GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API_SUCCESS:
      return {
        ...state,
        ProductTypeAPI: action.payload,
      }


    default:
      return state
  }
}

export default ProductTypesReducer