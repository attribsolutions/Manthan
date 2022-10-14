import {
    POST_METHOD_HANDLER_FOR_GROUPMASTER_API_SUCCESS,
    GET_METHOD_HANDLER_FOR_GROUPMASTER_SUCCESS,
    UPDATE_GROUPMASTER_ID_SUCCESS,
    DELETE_GROUPMASTER_ID_SUCCESS,
    EDIT_GROUPMASTER_ID_SUCCESS,
    GET_GROUPMASTER_LIST_SUCCESS
  } from "./actionTypes";
  
  const INIT_STATE = {
    PostDataMessage: { Status: false },
    CategoryAPI: [],
    CategoryListData: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
  }
  
  const CategoryReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_HANDLER_FOR_CATEGORY_API_SUCCESS:
        return {
          ...state,
          PostDataMessage: action.payload,
        }
  
      // get api
      case GET_CATEGORY_LIST_SUCCESS:
        return {
          ...state,
          CategoryListData: action.payload,
        }
  
      case DELETE_CATEGORY_ID_SUCCESS:
        return {
          ...state,
          deleteMessage: action.payload,
        };
  
      case EDIT_CATEGORY_ID_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
      // update api
      case UPDATE_CATEGORY_ID_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
  
      default:
        return state
    }
  }
  
  export default CategorMASTER