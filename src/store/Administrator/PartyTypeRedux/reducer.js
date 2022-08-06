import { DELETE_PARTY_TYPE_ID_SUCCESS, EDIT_PARTY_TYPE_ID_SUCCESS, GET_PARTY_TYPE_LIST_SUCCESS, POST_PARTY_TYPE_API_SUCCESS, UPDATE_PARTY_TYPE_ID_SUCCESS } from "./actionTypes";

  const INIT_STATE = {
    PostData: { Status: false },
    ListData: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
  }
  
  const PartyTypeReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_PARTY_TYPE_API_SUCCESS:
        return {
          ...state,
          PostData: action.payload,
        }
  
      // get api
      case GET_PARTY_TYPE_LIST_SUCCESS:
        return {
          ...state,
          ListData: action.payload,
        }
  
      case DELETE_PARTY_TYPE_ID_SUCCESS:
        return {
          ...state,
          deleteMessage: action.payload,
        };
  
      case EDIT_PARTY_TYPE_ID_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
      // update api
      case UPDATE_PARTY_TYPE_ID_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
  
  
      default:
        return state
    }
  }
  
  export default PartyTypeReducer