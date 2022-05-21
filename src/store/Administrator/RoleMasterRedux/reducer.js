import {
    GET_Role_API_SUCCESS,
    POST_ROLE,
    POST_SUCCESS,
    DELETE_ROLE,
    EDIT_ROLE,
    DELETE_SUCCESS,
    EDIT_SUCCESS,
    UPDATE_SUCCESS
  
  } from "./actionTypes";
  
  const INIT_STATE = {
    pages:[],
    AddUserMessage: { Status: 'false' },
    PostPage: [],
    deleteRoleID: [],
    deleteSuccessRole: { Status: 'false' },
    editRoleId: [],
    editData: { Status: 'false' },
    updateMessage: { Status: 'false' },
  };
  
  const RoleMaster_Reducer  = (state = INIT_STATE, action) => {
    switch (action.type) {

        // get api
        case GET_Role_API_SUCCESS:
            return {
              ...state,
              pages: action.payload,
            }

     // post api
      case POST_ROLE:
        return {
          ...state,
          PostPage: action.Data,
        };
      case POST_SUCCESS:
        return {
          ...state,
          AddUserMessage: action.payload,
        };
  
    // delete api
      case DELETE_ROLE:
        return {
          ...state,
          deleteRoleID: action.id,
        };
      case DELETE_SUCCESS:
        return {
          ...state,
          deleteSuccessRole: action.payload,
        };
  
        // edit api
      case EDIT_ROLE:
        return {
          ...state,
          editRoleId: action.payload
        };
      case EDIT_SUCCESS:
        return {
          ...state,
          editData: action.payload,
        };
  
    // update api
      case UPDATE_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
  
  
      default:
        return state;
    }
  };
  export default RoleMaster_Reducer;
  