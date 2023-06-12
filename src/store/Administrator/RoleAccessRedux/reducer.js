import {
  DELETE_ROLE_ACCESS_lIST_SUCCESS,
  GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  SAVE_COPY_ROLE_ACCESS_ACTION_SUCCESS,
  SAVE_ROLE_ACCESS_ADD_ACTION_SUCCESS,
  UPDATE_ROLE_ACCESS_lIST_SUCCESS,
  EDIT_ROLE_ACCESS_lIST_SUCCESS,
  SET_TABLE_DATA_ROLE_ACCSS_ADD_PAGE_SUCCESS,
  SAVE_ROLE_ACCESS_ADD_ACTION,
  UPDATE_ROLE_ACCESS_lIST,
} from "./actionType"


const INIT_STATE = {
  PageDropdownForRoleAccess: [],
  RoleListDataForRoleListPage: [],
  postMsg: { Status: false },
  postMsgCopy: { Status: false },
  deleteMsg: { Status: false },
  RoleAccessListPage: [],
  editData: { Status: false },
  updateMsg: { Status: false },
  AddPageTableDataRedux: [],
  saveBtnloading: false,
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

    case SAVE_ROLE_ACCESS_ADD_ACTION://  save AddRoleAccess 
      return {
        ...state,
        saveBtnloading: true,

      }

    case SAVE_ROLE_ACCESS_ADD_ACTION_SUCCESS://  save AddRoleAccess 
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,


      }

    case GET_ROLEACCESS_LIST_PAGE_SUCCESS: // get RoleAccess List Page
      return {
        ...state,
        RoleAccessListPage: action.payload,
      }

    case SAVE_COPY_ROLE_ACCESS_ACTION_SUCCESS: //  save copyRoleAccess 
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

    case UPDATE_ROLE_ACCESS_lIST:
      return {
        ...state,
        saveBtnloading: true,
      }
    case UPDATE_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,
      }

    case SET_TABLE_DATA_ROLE_ACCSS_ADD_PAGE_SUCCESS:
      return {
        ...state,
        AddPageTableDataRedux: action.payload,
      }

    default:
      return state
  }

}

export default RoleAccessReducer 