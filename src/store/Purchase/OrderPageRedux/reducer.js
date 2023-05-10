import { currentDate } from "../../../components/Common/CommonFunction"
import {

  UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS,
  GO_BUTTON_FOR_ORDER_PAGE_SUCCESS,
  SAVE_ORDER_FROM_ORDER_PAGE_SUCCESS,
  GET_ORDER_LIST_PAGE_SUCCESS,
  ORDER_LIST_FILTERS,
  GET_ORDER_LIST_PAGE,
  ORDER_APPROVAL_ACTION_SUCCESS,
  // ORDER_ADD_FILTERS,
} from "./actionType"

// const date = currentDate;

const INIT_STATE = {
  goBtnOrderAdd: null,
  postMsg: { Status: false },
  editData: { Status: false, Items: [] },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  orderList: [],
  orderlistFilter: { fromdate: currentDate, todate: currentDate, venderSelect: { value: '', label: "All" } },
  // orderAddFilter: { orderdate: currentDate, supplierSelect: '' }
  orderApprovalRedux: { Status: false },
}

const OrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    // case ORDER_ADD_FILTERS:
    //   return {
    //     ...state,
    //     orderAddFilter: action.payload,
    //   }

    case ORDER_LIST_FILTERS:
      return {
        ...state,
        orderlistFilter: action.payload,
      }

    case GO_BUTTON_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        goBtnOrderAdd: action.payload,
      }

    case SAVE_ORDER_FROM_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
      }

    case DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }

    // Order List Page 
    case GET_ORDER_LIST_PAGE_SUCCESS:
      return {
        ...state,
        orderList: action.payload,
      }
    // Order List Clear Previous list 
    case GET_ORDER_LIST_PAGE:
      return {
        ...state,
        orderList: [],
      }
    case ORDER_APPROVAL_ACTION_SUCCESS:
      return {
        ...state,
        orderApprovalRedux: action.payload,
      }


    default:
      return state
  }

}

export default OrderReducer