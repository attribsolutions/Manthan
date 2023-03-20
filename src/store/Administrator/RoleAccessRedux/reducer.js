import { LOGOUT_REST } from "../../auth/login/actionTypes"
import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  DELETE_ROLE_ACCESS_lIST_SUCCESS,
  GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  SAVE_COPY_ROLE_ACCESS_ACTION_SUCCESS,
  SAVE_ROLE_ACCESS_ADD_ACTION_SUCCESS,
  UPDATE_ROLE_ACCESS_lIST_SUCCESS,
  EDIT_ROLE_ACCESS_lIST_SUCCESS,
  DELETE_ROLE_ACCESS_MASTER_SUCCESS,
  SET_TABLE_DATA_ROLE_ACCSS_ADD_PAGE_SUCCESS,
} from "./actionType"


const INIT_STATE = {
  PageDropdownForRoleAccess: [],
  RoleListDataForRoleListPage: [],
  AddPage_PageMasterListForRoleAccess: [],
  GO_buttonPageMasterListForRoleAccess: [],
  postMsg: { Status: false },
  postMsgCopy: { Status: false },
  deleteMsg: { Status: false },
  RoleAccessListPage: [],
  editData: { Status: false },
  updateMsg: { Status: false },
  AddPageTableDataRedux:[],
  deleteState:[],
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

    case SAVE_ROLE_ACCESS_ADD_ACTION_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    // get RoleAccess List Page
    case GET_ROLEACCESS_LIST_PAGE_SUCCESS:
      return {
        ...state,
        RoleAccessListPage: action.payload,
      }

    //  post copy role access 


    case SAVE_COPY_ROLE_ACCESS_ACTION_SUCCESS:
      return {
        ...state,
        postMsgCopy: action.payload,
      }
    case EDIT_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case DELETE_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
    case UPDATE_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }
      
      
      case SET_TABLE_DATA_ROLE_ACCSS_ADD_PAGE_SUCCESS:
        return {
          ...state,
          AddPageTableDataRedux: action.payload,
        }

      case DELETE_ROLE_ACCESS_MASTER_SUCCESS:
        return {
          ...state,
          deleteState: action.payload,
        }

    default:
      return state
  }

}

export default RoleAccessReducer 