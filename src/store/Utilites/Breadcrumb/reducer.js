import {
  COMMON_BREADCRUMB_ALL_DETAIL,
  BREADCRUMB_ITEM_NAME,
  BREADCRUMB_SHOW_COUNT_LABLE
} from "./actionType"


const INIT_STATE = {
  bredcrumbItemName: '',
  showCountlabel: '',
  breadcrumbDetail: {}
}
const BreadcrumbReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case BREADCRUMB_ITEM_NAME:
      return {
        ...state,
        bredcrumbItemName: action.payload,
      }
    case BREADCRUMB_SHOW_COUNT_LABLE:
      return {
        ...state,
        showCountlabel: action.payload,
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
