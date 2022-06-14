import {
  DELETE_H_MODULE_ID_SUCCESS,
  EDIT_H_PAGES_ID_SUCCESS,
  GET_HPAGES_LIST_DATA_SUCCESS,
  GET_H_MODULES_SUCCESS,
  GET_H_SUB_MODULES_SUCCESS,
  GET_PAGELIST_SUCCESS,
  SAVE_HPAGES_SUCCESS,
  UPDATE_H_PAGES_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  modulesData: [],
  SubModulesData: [],
  HPagesListData: [],
  saveMessage: { Status: false },
  // modulesListError: {},
  deleteModuleID: { Status: false },
  // deleteModuleIDError: {},
  editData: { Status: false },
  updateMessage: { Status: false },
  PageList: [],
  PageAccess:[],

}

const H_Pages = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_H_MODULES_SUCCESS:
      return {
        ...state,
        modulesData: action.payload,
      }
    case GET_H_SUB_MODULES_SUCCESS:
      return {
        ...state,
        SubModulesData: action.payload,
      }
    case GET_HPAGES_LIST_DATA_SUCCESS:
      return {
        ...state,
        HPagesListData: action.payload,
      }
    case EDIT_H_PAGES_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }
    case SAVE_HPAGES_SUCCESS:
      return {
        ...state,
        saveMessage: action.payload,
      }
    case DELETE_H_MODULE_ID_SUCCESS:
      return {
        ...state,
        deleteModuleID: action.payload,
      }
    case UPDATE_H_PAGES_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      }

    // PageList Dropdown api
    case GET_PAGELIST_SUCCESS:
      return {
        ...state,
        PageList: action.payload,
      };

      // PageAccess Dropdown api
    case GET_PAGEACCESS_DROPDOWN_API_SUCCESS:
      return {
        ...state,
        PageAccess: action.payload,
      };
    default:
      return state
  }

}

export default H_Pages
