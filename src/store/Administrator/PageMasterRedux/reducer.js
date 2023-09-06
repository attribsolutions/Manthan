import {
  DELETE_PAGE_LIST_ID_SUCCESS,
  EDIT_PAGE_LIST_ID_SUCCESS,
  GET_CONTROL_TYPES_SUCCESS,
  GET_FIELD_VALIDATIONS_SUCCESS,
  GET_PAGES_LIST_ACTION_SUCCESS,
  GET_PAGEACCESS_DROPDOWN_API_SUCCESS,
  RELATED_PAGELIST_DROPDOWN_SUCCESS,
  SAVE_PAGE_MASTER_SUCCESS,
  UPDATE_PAGE_LIST_ID_SUCCESS,
  GET_PAGETYPE_SUCCESS,
  SAVE_PAGE_MASTER_ACTION,
  UPDATE_PAGE_LIST_ID_ACTION,
  PAGEMASTER_API_ERROR_ACTION,
  RELATED_PAGELIST_DROPDOWN_ACTION,
  GET_FIELD_VALIDATIONS,
  EDIT_PAGE_LIST_ID_ACTION,
  DELETE_PAGE_LIST_ID_ACTION,
  GET_FIELD_VALIDATIONS_FOR_ALL_TYPE_SUCCESS
} from "./actionType"

const INIT_STATE = {

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
  fieldValidationsALLType: [],
  fieldvalidationDropDownLoading: false,
  loading: false,
  saveBtnloading: false,
  listBtnLoading: false,
}

const H_Pages = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_PAGES_LIST_ACTION_SUCCESS:
      return {
        ...state,
        HPagesListData: action.payload,
      }

    case SAVE_PAGE_MASTER_ACTION:
      return {
        ...state,
        saveBtnloading: true
      }

    case SAVE_PAGE_MASTER_SUCCESS:
      return {
        ...state,
        saveMessage: action.payload,
        saveBtnloading: false
      }

    case EDIT_PAGE_LIST_ID_ACTION:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case EDIT_PAGE_LIST_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
        listBtnLoading: false,
      }

    case DELETE_PAGE_LIST_ID_ACTION:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case DELETE_PAGE_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteModuleID: action.payload,
        listBtnLoading: false,
      }

    case UPDATE_PAGE_LIST_ID_ACTION:
      return {
        ...state,
        saveBtnloading: true

      }

    case UPDATE_PAGE_LIST_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false
      }

    // PageList Dropdown api

    case RELATED_PAGELIST_DROPDOWN_ACTION:
      return {
        ...state,
        listBtnLoading: true,
      };

    case RELATED_PAGELIST_DROPDOWN_SUCCESS:
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

      case GET_FIELD_VALIDATIONS_FOR_ALL_TYPE_SUCCESS:
        return {
          ...state,
          fieldValidationsALLType: action.payload,
        }
      

    case PAGEMASTER_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
        fieldvalidationDropDownLoading: false,
        loading: false,

      };



    default:
      return state
  }


}

export default H_Pages
