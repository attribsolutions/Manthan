import {
  DELETE_H_MODULE_ID_SUCCESS,
  EDIT_H_PAGES_ID_SUCCESS,
  GET_CONTROL_TYPES_SUCCESS,
  GET_FIELD_VALIDATIONS_SUCCESS,
  GET_HPAGES_LIST_DATA_SUCCESS,
  GET_H_MODULES_SUCCESS,
  GET_H_SUB_MODULES_SUCCESS,
  GET_PAGEACCESS_DROPDOWN_API_SUCCESS,
  GET_PAGELIST_SUCCESS,
  SAVE_HPAGES_SUCCESS,
  UPDATE_H_PAGES_SUCCESS,
  GET_PAGETYPE_SUCCESS,
  SAVE_HPAGES,
  UPDATE_H_PAGES,
  PAGEMASTER_API_ERROR_ACTION,
  GET_PAGELIST,
  GET_FIELD_VALIDATIONS
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
  PageType: [],
  PageAccess: [],
  ControlTypes: [],
  FieldValidations: [],
  saveBtnloading: false,
  listBtnLoading: false,
  fieldvalidationDropDownLoading:false

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

    case SAVE_HPAGES:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_HPAGES_SUCCESS:
      return {
        ...state,
        saveMessage: action.payload,
        saveBtnloading: false

      }
    case DELETE_H_MODULE_ID_SUCCESS:
      return {
        ...state,
        deleteModuleID: action.payload,
      }

    case UPDATE_H_PAGES:
      return {
        ...state,
        saveBtnloading: true

      }

    case UPDATE_H_PAGES_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false
      }

    // PageList Dropdown api

    case GET_PAGELIST:
      return {
        ...state,
        listBtnLoading: true,
      };

    case GET_PAGELIST_SUCCESS:
      return {
        ...state,
        PageList: action.payload,
        listBtnLoading: false,
      };

    // PageType Dropdown api
    case GET_PAGETYPE_SUCCESS:
      return {
        ...state,
        PageType: action.payload,
      };

    // PageAccess Dropdown api
    case GET_PAGEACCESS_DROPDOWN_API_SUCCESS:
      return {
        ...state,
        PageAccess: action.payload,
      };

    case GET_CONTROL_TYPES_SUCCESS:
      return {
        ...state,
        ControlTypes: action.payload,
      }

    case GET_FIELD_VALIDATIONS:
      return {
        ...state,
        fieldvalidationDropDownLoading: true
      }

      case GET_FIELD_VALIDATIONS_SUCCESS:
      return {
        ...state,
        FieldValidations: action.payload,
        fieldvalidationDropDownLoading: false
      }

    case PAGEMASTER_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        fieldvalidationDropDownLoading: false


      };



    default:
      return state
  }


}

export default H_Pages
