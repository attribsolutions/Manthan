import {
  COMPANY_API_ERROR_ACTION,
  DELETE_COMPANY_ID,
  DELETE_COMPANY_ID_SUCCESS,
  EDIT_COMPANY_ID,
  EDIT_COMPANY_ID_SUCCESS,
  FETCH_COMPANY_LIST,
  FETCH_COMPANY_LIST_SUCCESS,
  GET_COMPANYGROUP_SUCCESS,
  POST_COMPANY_SUBMIT,
  POST_COMPANY_SUBMIT_SUCCESS,
  UPDATE_COMPANY_ID,
  UPDATE_COMPANY_ID_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  companyList: [],
  editData: { Status: false },
  deleteCompanyID: { Status: false },
  postMsg: { Status: false },
  updateMessage: { Status: false },
  CompanyGroup: [],
  saveBtnloading: false,
  listBtnLoading: false,
}

const Company = (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_COMPANY_LIST:
      return {
        ...state,
        listBtnLoading: true,
      }

    case FETCH_COMPANY_LIST_SUCCESS:
      return {
        ...state,
        companyList: action.payload,
        listBtnLoading: false,
      }


    case POST_COMPANY_SUBMIT:
      return {
        ...state,
        saveBtnloading: true
      }

    case POST_COMPANY_SUBMIT_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false

      }

    case DELETE_COMPANY_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
        deleteCompanyID: action.payload,
      }

    case DELETE_COMPANY_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteCompanyID: action.payload,
      }

    case EDIT_COMPANY_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      }

    case EDIT_COMPANY_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editData: action.payload,
      }

    case UPDATE_COMPANY_ID:
      return {
        ...state,
        saveBtnloading: true

      }

    case UPDATE_COMPANY_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false

      }

    /// CompanyGroupDropdown
    case GET_COMPANYGROUP_SUCCESS:
      return {
        ...state,
        CompanyGroup: action.payload,
      };

    case "RESET_ALL":
      return state = INIT_STATE;

    case COMPANY_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      };


    default:
      return state
  }

}

export default Company