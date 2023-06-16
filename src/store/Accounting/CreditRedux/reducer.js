import {
  CREDITDEBIT_TYPE_SUCCESS,
  DELETE_CREDIT_LIST_ID_SUCCESS,
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
  listLoading: false
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
        listLoading: true
      }

    case GET_CREDIT_LIST_SUCCESS:
      return {
        ...state,
        CreditList: action.payload,
        listLoading: false
      }
    //  del
    case DELETE_CREDIT_LIST_ID_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      };
    //  CredietDebit Type
    case CREDITDEBIT_TYPE_SUCCESS:
      return {
        ...state,
        CreditDebitType: action.payload,
      };

    case EDIT_CREDIT_LIST_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
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

    default:
      return state
  }
}

export default CredietDebitReducer;