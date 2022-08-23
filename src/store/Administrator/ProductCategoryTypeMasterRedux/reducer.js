import {   DELETE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS, EDIT_PRODUCT_CATEGORY_TYPE_ID_SUCCESS, GET_PRODUCT_CATEGORY_TYPE_LIST_SUCCESS, POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API_SUCCESS } from "./actionTypes";

  const INIT_STATE = {
    PostData: { Status: false },
    ListData: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
  }
  
  const  ProductCategoryTypeMasterReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API_SUCCESS:
        return {
          ...state,
          PostData: action.payload,
        }
  
      
       // get api
       case GET_PRODUCT_CATEGORY_TYPE_LIST_SUCCESS:
        return {
          ...state,
          ListData: action.payload,
        }
  
      case DELETE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS:
        return {
          ...state,
          deleteMessage: action.payload,
        };
  
      case EDIT_PRODUCT_CATEGORY_TYPE_ID_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
      // update api
      case UPDATE_PRODUCT_CATEGORY_TYPE_ID_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
  
  
  
      default:
        return state
    }
  }
  
  export default ProductCategoryTypeMasterReducer