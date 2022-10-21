import {
    POST_METHOD_FOR_COMPANYGROUP_MASTER_SUCCESS,
    GET_METHOD_FOR_COMPANYGROUP_LIST_SUCCESS,
    DELETE_COMPANYGROUP_TYPE_ID_SUCCESS,
    EDIT_COMPANYGROUP_TYPE_ID_SUCCESS,
    UPDATE_COMPANYGROUP_TYPE_ID_SUCCESS
  } from "./actionType";
  
  const INIT_STATE = {
    PostDataMessage: { Status: false },
    CompanyGroupList: [],
    deleteMessage: { Status: false },
    editData: { Status: false },
    updateMessage: { Status: false },
  }
  const CompanyGroupReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_FOR_COMPANYGROUP_MASTER_SUCCESS:
        return {
          ...state,
          PostDataMessage: action.payload,
        }
  
      case GET_METHOD_FOR_COMPANYGROUP_LIST_SUCCESS:
        return {
          ...state,
          CompanyGroupList: action.payload,
        }
  
    
  
        case DELETE_COMPANYGROUP_TYPE_ID_SUCCESS:
          return {
            ...state,
            deleteMessage: action.payload,
          };
    
        case EDIT_COMPANYGROUP_TYPE_ID_SUCCESS:
          return {
            ...state,
            editData: action.payload,
          };
    
        
        case UPDATE_COMPANYGROUP_TYPE_ID_SUCCESS:
          return {
            ...state,
            updateMessage: action.payload,
          };
  
  
      default:
        return state
    }
  }
  
  export default CompanyGroupReducer