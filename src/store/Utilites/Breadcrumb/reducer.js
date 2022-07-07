import {  BREADCRUMB_SHOW} from "./actionType"

 const INIT_STATE={
  bredcrumbName:'',
 }
const BreadcrumbReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case BREADCRUMB_SHOW:
      return {
        ...state,
        bredcrumbName: action.payload,
      }
    default:
      return state
  }
}

export default BreadcrumbReducer;