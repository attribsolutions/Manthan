import {
  POST_DEFAULT_MODULE_ID,
  POST_DEFAULT_MODULE_ID_SUCCESS,
  POST_SUB_MODULE,
  POST_SUB_MODULE_SUCCESS,
  GET_PAGE_ACCESS,
  GET_PAGE_ACCESS_SUCCESS,
  ADD_PAGE,
  ADD_PAGE_SUCCESS,
  GET_DEFAULT_MODULE_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  DefaultModuleData: [],
  SubModuleID:[],
  ModuleData: [],
  SubModuleData: [],
  AddPageMessage:{},
  PageAccessData:[],
  AddPageData:[],
};

const PageList = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    case GET_DEFAULT_MODULE_SUCCESS:
      return {
        ...state,
        DefaultModuleData: action.payload,
      };
    case POST_DEFAULT_MODULE_ID:
      return {
        ...state,
        //  ModuleId: action.payload,
      };
    case POST_DEFAULT_MODULE_ID_SUCCESS:
      return {
        ...state,
        ModuleData: action.payload,
      };
    case POST_SUB_MODULE:
      return {
        ...state,
        SubModuleID: action.id,
      };
      case POST_SUB_MODULE_SUCCESS:
        return {
          ...state,
          SubModuleData: action.payload,
        };
      case GET_PAGE_ACCESS:
        return {
          ...state,
         
        };
        case GET_PAGE_ACCESS_SUCCESS:
          return {
            ...state,
            PageAccessData: action.payload,
          };
   
      case ADD_PAGE:
        return {
          ...state,
          AddPage: action.Data,
        };
        case ADD_PAGE_SUCCESS:
          return {
            ...state,
            AddPageMessage: action.payload,
          };
        
    default:
      return state;
  }
};
export default PageList;
