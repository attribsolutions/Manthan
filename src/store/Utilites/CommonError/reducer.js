import { COMMON_400_ERROR, COMMON_500_ERROR, COMMON_PAGE_FILED_lIST_SUCCESS, COMMON_PAGE_FILED_SUCCESS } from "./actionType"

const INIT_STATE = {
  error500: null,
  error400: null,
}

const CommonError = (state = INIT_STATE, action) => {
  switch (action.type) {

    case COMMON_400_ERROR:
      return {
        ...state,
        error400: action.payload,
      }
    case COMMON_500_ERROR:
      return {
        ...state,
        error500: action.payload,
      }

    default:
      return state
  }
}

export default CommonError;