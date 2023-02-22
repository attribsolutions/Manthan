import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  CHALLAN_POST_API_SUCCESS,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  GET_CHALLAN_LIST_PAGE_SUCCESS,
  GO_BUTTON_CHALLAN_POST_API_SUCCESS,
  GO_BUTTON_FOR_CHALLAN_ADD_SUCCESS,
  POST_ITEM_CHALLAN_PAGE_SUCCESS,
  SET_CHALLAN_LIST_FILTERS,

} from "./actionType"


// const date = currentDate();

const INIT_STATE = {

  deleteMsg: { Status: false },
  ChallanList: [],
  ChallanlistFilter: { fromdate: currentDate, todate: currentDate, venderSelect: { value: '', label: "All" } },
  gobutton_Add:[],
  GoButton:[],
  challanitems:[],
  postMsg: { Status: false },


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
    case POST_ITEM_CHALLAN_PAGE_SUCCESS:
      return {
        ...state,
        challanitems: action.payload,
      }

    case SET_CHALLAN_LIST_FILTERS:
      return {
        ...state,
        ChallanlistFilter: action.payload,
      }
    case GET_CHALLAN_LIST_PAGE_SUCCESS:
      return {
        ...state,
        ChallanList:action.payload,
      }

    case DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
      case CHALLAN_POST_API_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }
    default:
      return state
  }

}
export default ChallanReducer