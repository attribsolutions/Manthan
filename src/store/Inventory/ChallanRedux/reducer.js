import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
  DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  GET_CHALLAN_LIST_PAGE_SUCCESS,
  SET_CHALLAN_LIST_FILTERS,
 
} from "./actionType"


// const date = currentDate();

const INIT_STATE = {

  deleteMsg: { Status: false },
  ChallanList:[],
  ChallanlistFilter: { fromdate: currentDate, todate: currentDate, venderSelect: { value: '', label: "All" } }
}

const ChallanReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SET_CHALLAN_LIST_FILTERS:
      return {
        ...state,
        ChallanlistFilter: action.payload,
      }
    case GET_CHALLAN_LIST_PAGE_SUCCESS:
      return {
        ...state,
        ChallanList: action.payload,
      }

    case DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
    default:
      return state
  }

}
export default ChallanReducer