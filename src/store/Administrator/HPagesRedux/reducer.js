import {
  EDIT_H_PAGES_ID_SUCCESS,
  GET_HPAGES_LIST_DATA_SUCCESS,
  GET_H_MODULES_SUCCESS,
  GET_H_SUB_MODULES_SUCCESS,
  GET_PAGELIST_SUCCESS,
  GET_PAGETYPE_SUCCESS,
  SAVE_HPAGES_SUCCESS,
  UPDATE_H_PAGES_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  modulesData: [],
  SubModulesData: [],
  HPagesListData: [],
  saveMessage: [],
  // modulesListError: {},
  // deleteModuleIDSuccess: { Status: 'false' },
  // deleteModuleIDError: {},
  editData: { Status: 'false' },
  updateMessage: {},
  PageList:[],
  PageType:[]
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
    // case POST_MODULES_SUBMIT_ERROR:
    //   return {
    //     ...state,
    //     modulesSubmitError: action.payload,
    //   }
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
    // case DELETE_MODULE_ID_SUCCESS:
    //   return {
    //     ...state,
    //     deleteModuleIDSuccess: action.payload,
    //   }
    // case DELETE_MODULE_ID_ERROR:
    //   return {
    //     ...state,
    //     deleteModuleIDError: action.payload,
    //   }
    case UPDATE_H_PAGES_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      }

    // PageType Dropdown api
    case GET_PAGETYPE_SUCCESS:
      return {
        ...state,
        PageType: action.payload,
      };

    // PageList Dropdown api
    case GET_PAGELIST_SUCCESS:
      return {
        ...state,
        PageList: action.payload,
      };

    default:
      return state
  }

}

export default H_Pages
