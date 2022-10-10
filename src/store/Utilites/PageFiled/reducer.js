import { COMMON_PAGE_FILED_SUCCESS } from "./actionType"

 const INIT_STATE={
  pageField: {},
 }

const CommonPageFieldReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case COMMON_PAGE_FILED_SUCCESS:
      return {
        ...state,
        pageField: action.payload,
      }
    
    default:
      return state
  }
}

export default CommonPageFieldReducer;