import {
  CHALLAN_POST_API_SUCCESS,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  CHALLAN_LIST_FOR_LIST_PAGE_SUCCESS,
  GO_BUTTON_CHALLAN_POST_API_SUCCESS,
  GO_BUTTON_FOR_CHALLAN_ADD_SUCCESS,
  ITEM_DROPDOWN_CHALLAN_SUCCESS,
  MAKE_CHALLAN_ACTION_SUCCESS,

} from "./actionType"


const INIT_STATE = {
  deleteMsg: { Status: false },
  ChallanList: [],
  gobutton_Add: [],
  GoButton: [],
  challanitems: [],
  postMsg: { Status: false },
  makeChallan: { Status: false }


}

const ChallanReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GO_BUTTON_CHALLAN_POST_API_SUCCESS:
      return {
        ...state,
        GoButton: action.payload,
      }
    case GO_BUTTON_FOR_CHALLAN_ADD_SUCCESS:
      return {
        ...state,
        gobutton_Add: action.payload,
      }

    case ITEM_DROPDOWN_CHALLAN_SUCCESS:
      return {
        ...state,
        challanitems: action.payload,
      }

    case CHALLAN_LIST_FOR_LIST_PAGE_SUCCESS: // challan List  by filters
      return {
        ...state,
        ChallanList: action.payload,
      }

    case DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS://Delete challan
      return {
        ...state,
        deleteMsg: action.payload,
      }
    case CHALLAN_POST_API_SUCCESS://SAVE challan
      return {
        ...state,
        postMsg: action.payload,
      }
    case MAKE_CHALLAN_ACTION_SUCCESS: //Make  challan
      return {
        ...state,
        makeChallan: action.payload,
      }

    default:
      return state
  }

}
export default ChallanReducer