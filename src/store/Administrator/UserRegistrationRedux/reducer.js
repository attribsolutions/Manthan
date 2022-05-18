import {
    GET_EMPLOYEE_SUCCESS,
    GET_ROLE_SUCCESS,
    ADD_USER_SUCCESS,
    GET_USER_SUCCESS,
    UPDATE_SUCCESS,
    EDIT_SUCCESS,
    EDIT_USER,
    DELETE_SUCCESS,
    DELETE_USER,
    
    }from './actionType'
  const INIT_STATE = {
    employee: [],
    Roles:[],
    AddUser:[],
    AddUserMessage:[],
    pages:[],
    deleteRoleID: [],
    deleteSuccessRole: [],
    editRoleId: [],
    editData: { Status: 'false' },
    updateMessage:  { Status: 'false' }
  };
  const User_Registration_Reducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_EMPLOYEE_SUCCESS:
        return {
          ...state,
          employee: action.payload,
        };
  
        case GET_ROLE_SUCCESS:
          return {
            ...state,
            Roles: action.payload,
          }
  
            case ADD_USER_SUCCESS:
              return {
                ...state,
                AddUserMessage: action.payload,
              };
  
                //// get Registration api
          case GET_USER_SUCCESS:
            return {
              ...state,
              pages: action.payload,
            }
  
            //// delete api
        case DELETE_USER:
          return {
            ...state,
            deleteRoleID: action.id,
          };
        case DELETE_SUCCESS:
          return {
            ...state,
            deleteSuccessRole: action.payload,
          };
    
          //// edit api
        case EDIT_USER:
          return {
            ...state,
            editRoleId: action.payload
          };
        case EDIT_SUCCESS:
          return {
            ...state,
            editData: action.payload,
          };
    
      //// update api
        case UPDATE_SUCCESS:
          return {
            ...state,
            updateMessage: action.payload,
          };
          
        default:
        return state;
    }
  };
  
  export default User_Registration_Reducer;
  