import {
  CREDITDEBIT_TYPE_SUCCESS,
  CREDIT_DEBIT_API_ERROR_ACTION,
  DELETE_CREDIT_LIST_ID,
  DELETE_CREDIT_LIST_ID_SUCCESS,
  EDIT_CREDIT_LIST_ID,
  EDIT_CREDIT_LIST_ID_SUCCESS,
  GET_CREDIT_LIST,
  GET_CREDIT_LIST_SUCCESS,
  INVOICE_RETURN_ID_SUCCESS,
  RECEIPT_NUMBER_LIST_SUCCESS,
  SAVE_CREDIT,
  SAVE_CREDIT_SUCCESS,
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  CreditList: [],
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  CreditDebitType: [],
  InvoiceReturn: [],
  ReceiptNumber: [],
  saveBtnloading: false,
  listBtnLoading: false
}

const CredietDebitReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post

    case SAVE_CREDIT:
      return {
        ...state,
        saveBtnloading: true,

      }
    case SAVE_CREDIT_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      }

    // get 
    case GET_CREDIT_LIST:
      return {
        ...state,
        listBtnLoading: true
      }

    case GET_CREDIT_LIST_SUCCESS:
      return {
        ...state,
        CreditList: action.payload,
        listBtnLoading: false
      }

    //  del
    case DELETE_CREDIT_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case DELETE_CREDIT_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
        listBtnLoading: false
      };

    //  CredietDebit Type
    case CREDITDEBIT_TYPE_SUCCESS:
      return {
        ...state,
        CreditDebitType: action.payload,
      };

      
    case EDIT_CREDIT_LIST_ID:
      return {
        ...state,
        listBtnLoading: action.config.btnId,
      };

    case EDIT_CREDIT_LIST_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
        listBtnLoading: false
      };

    case INVOICE_RETURN_ID_SUCCESS:
      return {
        ...state,
        InvoiceReturn: action.payload,
      };

    case RECEIPT_NUMBER_LIST_SUCCESS:
      return {
        ...state,
        ReceiptNumber: action.payload,
      };

    case CREDIT_DEBIT_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false,
        listBtnLoading: false,
      }

    default:
      return state
  }
}

export default CredietDebitReducer;