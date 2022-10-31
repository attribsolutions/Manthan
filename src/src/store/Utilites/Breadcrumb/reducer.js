import {
  BREADCRUMB_FILTER_SIZE,
  BREADCRUMB_SEARCH_PROPS,
  BREADCRUMB_SHOW
} from "./actionType"

let search = {
  onClear: function onClear() { },
  onSearch: function onSearch() { },
  searchText: ""
}

const INIT_STATE = {
  bredcrumbName: '',
  filterSize: '',
  searchProps: search
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
    case BREADCRUMB_SEARCH_PROPS:
      return {
        ...state,
        searchProps: action.payload,
      }
    default:
      return state
  }
}

export default BreadcrumbReducer;