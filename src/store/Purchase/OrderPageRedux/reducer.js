import {
  GET_ORDER_LIST_SUCCESS,
  GET_ORDER_ITEMS_FOR_ORDER_PAGE_SUCCESS,
  SUBMIT_ORDER_FROM_ORDER_PAGE_SUCCESS,
  GET_DIVISIONORDER_LIST_SUCCESS,
  GET_ORDER_LIST_MESSAGE,
  EDIT_ORDER_SUCCESS,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS,
  GET_SUPPLIER_SUCCESS,
  GO_BUTTON_FOR_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE_SUCCESS,
  POST_ORDER_FROM_ORDER_PAGE_SUCCESS,
  GET_ORDER_LIST_PAGE_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  orderItem: [],
  postMsg: { Status: false },
  editData: { Status: false, Items: [] },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  orderList: []


}

const OrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GO_BUTTON_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        orderItem: action.payload,
      }


    case POST_ORDER_FROM_ORDER_PAGE_SUCCESS:
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
    default:
      return state
  }

}

export default OrderReducer