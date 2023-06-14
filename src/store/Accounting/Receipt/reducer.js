import { currentDate_ymd } from "../../../components/Common/CommonFunction"
import {
  DEPOSITOR_BANK_FILTER_SUCCESS,
  RECEIPT_LIST_API_SUCCESS,
  RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  SAVE_RECEIPT_MASTER_SUCCESS,
  RECEIPT_TYPE_API_SUCCESS,
  DELETE_RECEIPT_LIST_SUCCESS,
  GET_OPENING_BALANCE_SUCCESS,
  BANK_LIST_API_SUCCESS,
  RECEIPT_LIST_FILTERS,
  PAYMENT_ENTRY_LIST_FILTERS,
  RECEIPT_LIST_API,
  SAVE_RECEIPT_MASTER,
} from "./actionType"

const INIT_STATE = {
  saveBtnloading: false,
  loading: false,
  ReceiptGoButton: [],
  ReceiptList: [],
  postMsg: { Status: false },
  ReceiptType: [],
  deleteMsg: { Status: false },
  OpeningBalance: '',
  bankList: [],
  receiptlistFilters: { fromdate: currentDate_ymd, todate: currentDate_ymd, Customer: { value: '', label: "All" } },
  paymentEntrylistFilters: { fromdate: currentDate_ymd, todate: currentDate_ymd, Customer: { value: '', label: "All" } }
}

const ReceiptReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case RECEIPT_LIST_FILTERS:
      return {
        ...state,
        receiptlistFilters: action.payload,
      }
    case PAYMENT_ENTRY_LIST_FILTERS:
      return {
        ...state,
        paymentEntrylistFilters: action.payload,
      }
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

    case SAVE_RECEIPT_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_RECEIPT_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false
      }

    case RECEIPT_LIST_API:
      return {
        ...state,
        loading: true,
      }

    case RECEIPT_LIST_API_SUCCESS:
      return {
        ...state,
        ReceiptList: action.payload,
        loading: false,

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