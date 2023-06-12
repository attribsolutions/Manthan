import {
  UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS,
  EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS,
  DELETE_ORDER_FOR_ORDER_PAGE_SUCCESS,
  GO_BUTTON_FOR_ORDER_PAGE_SUCCESS,
  SAVE_ORDER_FROM_ORDER_PAGE_SUCCESS,
  GET_ORDER_LIST_PAGE_SUCCESS,
  GET_ORDER_LIST_PAGE,
  ORDER_APPROVAL_ACTION_SUCCESS,
  GET_ORDER_APPROVAL_DETAIL_SUCCESS,
  UPDATE_ORDER_ID_FROM_ORDER_PAGE,
  SAVE_ORDER_FROM_ORDER_PAGE,
  GO_BUTTON_FOR_ORDER_PAGE,
  ORDER_APPROVAL_ACTION,
  GET_ORDER_APPROVAL_DETAIL,
} from "./actionType"


const INIT_STATE = {
  loading: false,
  saveBtnloading: false,
  goBtnOrderAdd: null,
  postMsg: { Status: false },
  editData: { Status: false, Items: [] },
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  orderList: [],
  orderApprovalMsg: { Status: false },
  approvalDetail: { Status: false },
}

const OrderReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    case GO_BUTTON_FOR_ORDER_PAGE:
      return {
        ...state,
        loading: true,
      }

    case GO_BUTTON_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        goBtnOrderAdd: action.payload,
      }

    case SAVE_ORDER_FROM_ORDER_PAGE:
      return {
        ...state,
        saveBtnloading: true,
      }
    case SAVE_ORDER_FROM_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        saveBtnloading: false,
        postMsg: action.payload,
      }

    case EDIT_ORDER_FOR_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_ORDER_ID_FROM_ORDER_PAGE:
      return {
        ...state,
        saveBtnloading: true,
      }

    case UPDATE_ORDER_ID_FROM_ORDER_PAGE_SUCCESS:
      return {
        ...state,
        saveBtnloading: false,
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
        loading: false

      }

    case GET_ORDER_LIST_PAGE:
      return {
        ...state,
        loading: true,
        orderList: [],
      }

      case GET_ORDER_APPROVAL_DETAIL:
      return {
        ...state,
        saveBtnloading: true,
      }

    case GET_ORDER_APPROVAL_DETAIL_SUCCESS:
      return {
        ...state,
        saveBtnloading: false,
        approvalDetail: action.payload,
      }

    case ORDER_APPROVAL_ACTION:
      return {
        ...state,
        saveBtnloading: true,
      }
    case ORDER_APPROVAL_ACTION_SUCCESS:
      return {
        ...state,
        saveBtnloading: false,
        orderApprovalMsg: action.payload,
      }


    default:
      return state
  }

}

export default OrderReducer