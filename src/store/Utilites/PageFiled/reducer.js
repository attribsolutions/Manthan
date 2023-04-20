import { COMMON_PAGE_FILED_lIST_SUCCESS, COMMON_PAGE_FILED_SUCCESS } from "./actionType"

 const INIT_STATE={
  pageField: null,
  pageFieldList: null,
 }

const CommonPageFieldReducer = (state = INIT_STATE, action) => {
   
  switch (action.type) {

    case COMMON_PAGE_FILED_SUCCESS:
      return {
        ...state,
        pageField: action.payload,
      }
      case COMMON_PAGE_FILED_lIST_SUCCESS:
      return {
        ...state,
        pageFieldList: action.payload,
      }
    
    default:
      return state
  }
}

export default CommonPageFieldReducer;