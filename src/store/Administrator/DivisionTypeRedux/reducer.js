import { DELETE_DIVISION_TYPE_ID_SUCCESS, EDIT_DIVISION_TYPE_ID_SUCCESS, GET_DIVISION_TYPE_LIST_SUCCESS, POST_DIVISION_TYPE_API_SUCCESS, UPDATE_DIVISION_TYPE_ID_SUCCESS } from "./actionType";

  const INIT_STATE = {
    PostData: { Status: false },
    ListData: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
  }
  
  const DivisionTypeReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_DIVISION_TYPE_API_SUCCESS:
        return {
          ...state,
          PostData: action.payload,
        }
  
      // get api
      case GET_DIVISION_TYPE_LIST_SUCCESS:
        return {
          ...state,
          ListData: action.payload,
        }
  
      case DELETE_DIVISION_TYPE_ID_SUCCESS:
        return {
          ...state,
          deleteMessage: action.payload,
        };
  
      case EDIT_DIVISION_TYPE_ID_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
      // update api
      case UPDATE_DIVISION_TYPE_ID_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
  
  
      default:
        return state
    }
  }
  
  export default DivisionTypeReducer