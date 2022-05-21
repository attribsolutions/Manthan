import {
  DELETE_COMPANY_ID_SUCCESS,
  EDIT_COMPANY_ID_SUCCESS,
  FETCH_COMPANY_LIST_SUCCESS,
  POST_COMPANY_SUBMIT_SUCCESS,
  UPDATE_COMPANY_ID_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  companyList: [],
  editData: { Status: 'false' },
  deleteCompanyIDSuccess: { Status: 'false' },
  companySubmitSuccesss: { Status: 'false' },
  updateMessage:{Status: 'false'}

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
        deleteCompanyIDSuccess: action.payload,
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




    default:
      return state
  }

}

export default Company