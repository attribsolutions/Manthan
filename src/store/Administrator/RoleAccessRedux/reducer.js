import { LOGOUT_REST } from "../../auth/login/actionTypes"
import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  POST_METHOD_HANDLER_FOR_COPY_ROLE_ACCESS_FOR_ROLE_SUCCESS,
  POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  PageDropdownForRoleAccess: [],
  RoleListDataForRoleListPage: [],
  AddPage_PageMasterListForRoleAccess: [],
  GO_buttonPageMasterListForRoleAccess: [],
  PostMessage_ForRoleAccessList: { Status: false },
  RoleAccessListPage: [],
  PostMessage_ForCopyRoleAccess: { Status: false },
}

const RoleAccessReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        RoleListDataForRoleListPage: action.payload,
      }

    case PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        PageDropdownForRoleAccess: action.payload,
      }

    case GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        GO_buttonPageMasterListForRoleAccess: action.payload,
      }

    case ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        AddPage_PageMasterListForRoleAccess: action.payload,
      }

    case POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS:
      return {
        ...state,
        PostMessage_ForRoleAccessList: action.payload,
      }

    // get RoleAccess List Page
    case GET_ROLEACCESS_LIST_PAGE_SUCCESS:
      return {
        ...state,
        RoleAccessListPage: action.payload,
      }

 //  post copy role access 
 

   case POST_METHOD_HANDLER_FOR_COPY_ROLE_ACCESS_FOR_ROLE_SUCCESS:
    return{
         ...state,
         PostMessage_ForCopyRoleAccess: action.payload,
    }

    case  LOGOUT_REST: 
      return{
           ...state,
        RoleListDataForRoleListPage:[],

      }
    default:
      return state
  }

}

export default RoleAccessReducer 