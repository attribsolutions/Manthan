import { currentDate } from "../../../components/Common/CommonFunction"
import {
  DEPOSITOR_BANK_FILTER_SUCCESS,
  POST_RECEIPT_LIST_PAGE,
  RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  RECEIPT_LIST_FILTERS,
  SAVE_RECEIPT_MASTER_SUCCESS,
} from "./actionType"


const INIT_STATE = {
  ReceiptGoButton: [],
  DepositorBank: [],
  ReceiptList: [],
  postMsg: { Status: false },
  ReceiptFilters: { fromdate: currentDate, todate: currentDate, CusomerSelect: { value: '', label: "All" } },
}

const ReceiptReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case RECEIPT_GO_BUTTON_MASTER_SUCCESS:
      return {
        ...state,
        ReceiptGoButton: action.payload,
      }

    case RECEIPT_LIST_FILTERS:
      return {
        ...state,
        ReceiptFilters: action.payload,
      }

    case DEPOSITOR_BANK_FILTER_SUCCESS:
      return {
        ...state,
        DepositorBank: action.payload,
      }

    case SAVE_RECEIPT_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    case POST_RECEIPT_LIST_PAGE:
      return {
        ...state,
        ReceiptList: [],
      }

    default:
      return state
  }
}

export default ReceiptReducer