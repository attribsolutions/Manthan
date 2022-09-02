import {
    POST_METHOD_HANDLER_FOR_SUBCATEGORY_API_SUCCESS,
    GET_METHOD_HANDLER_FOR_SUBCATEGORY_API_SUCCESS,
    UPDATE_SUBCATEGORY_ID_SUCCESS,
    DELETE_SUBCATEGORY_ID_SUCCESS,
     EDIT_SUBCATEGORY_ID_SUCCESS,
      GET_SUBCATEGORY_LIST_SUCCESS

    
  } from "./actionTypes";
  
  const INIT_STATE = {
     PostDataMessage: { Status: false },
     SubCategoryAPI: [],
     SubCategoryListData: [],
      deleteMessage: { Status: false },
      editData: { Status: false },
      updateMessage: { Status: false },
      
  }
  
  const SubCategoryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_HANDLER_FOR_SUBCATEGORY_API_SUCCESS:
        return {
          ...state,
          PostDataMessage: action.payload,
        }
  
      case GET_METHOD_HANDLER_FOR_SUBCATEGORY_API_SUCCESS:
        return {
          ...state,
          SubCategoryAPI: action.payload,
        }
  
        // get api
        case GET_SUBCATEGORY_LIST_SUCCESS:
          return {
            ...state,
            SubCategoryListData: action.payload,
          }
    
        case DELETE_SUBCATEGORY_ID_SUCCESS:
          return {
            ...state,
            deleteMessage: action.payload,
          };
    
        case EDIT_SUBCATEGORY_ID_SUCCESS:
          return {
            ...state,
            editData: action.payload,
          };
    
        // update api
        case UPDATE_SUBCATEGORY_ID_SUCCESS:
          return {
            ...state,
            updateMessage: action.payload,
          };
  
      default:
        return state
    }
  }
  
  export default SubCategoryReducer