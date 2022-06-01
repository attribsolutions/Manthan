import {
  DELETE_COMPANY_ID_SUCCESS,
  EDIT_COMPANY_ID_SUCCESS,
  FETCH_COMPANY_LIST_SUCCESS,
  GET_COMPANYGROUP_SUCCESS,
  POST_COMPANY_SUBMIT_SUCCESS,
  UPDATE_COMPANY_ID_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  companyList: [],
  editData: { Status: false },
  deleteCompanyID: { Status: false },
  companySubmitSuccesss: { Status: false },
  updateMessage:{ Status: false },
  CompanyGroup:[],
}

const Company = (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_COMPANY_LIST_SUCCESS:
      return {
        ...state,
        companyList: action.payload,
      }

    case POST_COMPANY_SUBMIT_SUCCESS:
      return {
        ...state,
        companySubmitSuccesss: action.payload,
      }

    case DELETE_COMPANY_ID_SUCCESS:
      return {
        ...state,
        deleteCompanyID: action.payload,
      }
    //     case DELETE_MODULE_ID_ERROR:
    //       return {
    //         ...state,
    //         deleteModuleIDError: action.payload,
    //       }
    case EDIT_COMPANY_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }
    case UPDATE_COMPANY_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      }

    /// CompanyGroupDropdown
    case GET_COMPANYGROUP_SUCCESS:
      return {
        ...state,
        CompanyGroup: action.payload,
      };



    default:
      return state
  }

}

export default Company