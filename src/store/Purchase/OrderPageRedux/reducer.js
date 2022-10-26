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
  supplier:[],
  orderItem:[],
  OrderItemsOld: [],
  postMsg: { Status: false },
  ordersList: [],
  orderListMessage: [],
  editOrderData: { Status: false, Items: [] },
  updateMessage: { Status: false },
  deleteMessage: { Status: false },
  OrderListPage:[]


}

const OrderPageReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case GET_SUPPLIER_SUCCESS:
      return {
        ...state,
        supplier: action.payload,
      }
      case GO_BUTTON_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        orderItem: action.payload,
      }
      case GET_ORDER_ITEMS_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        OrderItemsOld: action.payload,
      }
    case POST_ORDER_FROM_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case GET_ORDER_LIST_SUCCESS:
      return {
        ...state,
        ordersList: action.payload,
      }
    case GET_ORDER_LIST_MESSAGE:
      return {
        ...state,
        orderListMessage: action.payload,
      }
    case EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        editOrderData: action.payload,
      }
    case UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      }
    case DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      }

      // Order List Page 
      case GET_ORDER_LIST_PAGE_SUCCESS:
        return {
          ...state,
          OrderListPage: action.payload,
        }
    default:
      return state
  }

}

export default OrderPageReducer