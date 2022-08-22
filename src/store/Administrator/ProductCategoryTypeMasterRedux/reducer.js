import {POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API_SUCCESS } from "./actionTypes";

  const INIT_STATE = {
    PostData: { Status: false },
    
  }
  
  const  ProductCategoryTypeMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API_SUCCESS:
        return {
          ...state,
          PostData: action.payload,
        }
  
      
      
  
      default:
        return state
    }
  }
  
  export default ProductCategoryTypeMasterReducer