import {
  DEPOSITOR_BANK_FILTER_SUCCESS,
  RECEIPT_LIST_API_SUCCESS,
  RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  SAVE_RECEIPT_MASTER_SUCCESS,
  RECEIPT_TYPE_API_SUCCESS,
  DELETE_RECEIPT_LIST_SUCCESS,
  GET_OPENING_BALANCE_SUCCESS,
  BANK_LIST_API_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  ReceiptGoButton: [],
  ReceiptList: [],
  postMsg: { Status: false },
  ReceiptType: [],
  deleteMsg: { Status: false },
  OpeningBalance: [],
  bankList:[]
}

const ReceiptReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case RECEIPT_GO_BUTTON_MASTER_SUCCESS:
      return {
        ...state,
        ReceiptGoButton: action.payload,
      }

    case GET_OPENING_BALANCE_SUCCESS:
      return {
        ...state,
        OpeningBalance: action.payload,
      }

     case SAVE_RECEIPT_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case RECEIPT_LIST_API_SUCCESS:
      return {
        ...state,
        ReceiptList: action.payload,
      }

    case RECEIPT_TYPE_API_SUCCESS:
      return {
        ...state,
        ReceiptType: action.payload,
      }

    case DELETE_RECEIPT_LIST_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }

      case BANK_LIST_API_SUCCESS:
      return {
        ...state,
        bankList: action.payload,
      }
    default:
      return state
  }
}

export default ReceiptReducer