import {
  BREADCRUMB_FILTER_SIZE,
  COMMON_BREADCRUMB_ALL_DETAIL,
  BREADCRUMB_SHOW
} from "./actionType"


const INIT_STATE = {
  bredcrumbName: '',
  filterSize: '',
  breadcrumbDetail: {}
}
const BreadcrumbReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case BREADCRUMB_SHOW:
      return {
        ...state,
        bredcrumbName: action.payload,
      }
    case BREADCRUMB_FILTER_SIZE:
      return {
        ...state,
        filterSize: action.payload,
      }
    case COMMON_BREADCRUMB_ALL_DETAIL:
      return {
        ...state,
        breadcrumbDetail: action.payload,
      }
    default:
      return state
  }
}

export default BreadcrumbReducer;
