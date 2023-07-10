import {
  RECEIPT_LIST_API,
  RECEIPT_LIST_API_SUCCESS,
  RECEIPT_GO_BUTTON_MASTER,
  RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  SAVE_RECEIPT_MASTER,
  SAVE_RECEIPT_MASTER_SUCCESS,
  RECEIPT_TYPE_API,
  RECEIPT_TYPE_API_SUCCESS,
  DELETE_RECEIPT_LIST,
  DELETE_RECEIPT_LIST_SUCCESS,
  GET_OPENING_BALANCE,
  GET_OPENING_BALANCE_SUCCESS,
  BANK_LIST_API,
  BANK_LIST_API_SUCCESS,
  RECEIPT_LIST_FILTERS,
  PAYMENT_ENTRY_LIST_FILTERS,
  RECEIPT_AND_PAYMENT_API_ERROR_ACTION
} from "./actionType";

export const Receiptlistfilters = filter => ({                            //Material issue  Filter Action
  type: RECEIPT_LIST_FILTERS,
  payload: filter,
})

export const PaymentEntrylistfilters = filter => ({                            //Material issue  Filter Action
  type: PAYMENT_ENTRY_LIST_FILTERS,
  payload: filter,
})

export const ReceiptGoButtonMaster = (config={}) => ({// save Action
  type: RECEIPT_GO_BUTTON_MASTER,
  config
});

export const ReceiptGoButtonMaster_Success = (resp) => ({// Save  success
  type: RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  payload: resp,
});

// OpeningBalance value
export const GetOpeningBalance = (jsonBody) => ({// save Action
  type: GET_OPENING_BALANCE,
  jsonBody,
});

export const GetOpeningBalance_Success = (resp) => ({// Save  success
  type: GET_OPENING_BALANCE_SUCCESS,
  payload: resp,
});

// save API
export const saveReceiptMaster = (config = {}) => ({// save Action
  type: SAVE_RECEIPT_MASTER,
  config,
});

export const saveReceiptMaster_Success = (resp) => ({// Save  success
  type: SAVE_RECEIPT_MASTER_SUCCESS,
  payload: resp,
});

export const ReceiptListAPI = (jsonBody, subPageMode) => ({
  type: RECEIPT_LIST_API,
  jsonBody, subPageMode,
});

export const ReceiptListAPISuccess = (resp) => ({
  type: RECEIPT_LIST_API_SUCCESS,
  payload: resp,
});

// only use for Receipt type ID post in jsonbody
export const ReceiptTypeAPI = (jsonBody) => ({
  type: RECEIPT_TYPE_API,
  jsonBody,
});

export const ReceiptTypeAPISuccess = (resp) => ({
  type: RECEIPT_TYPE_API_SUCCESS,
  payload: resp,
});

// delete API
export const deleteReceiptList = (config = {}) => ({// save Action
  type: DELETE_RECEIPT_LIST,
  config,
});

export const deleteReceiptList_Success = (resp) => ({// Save  success
  type: DELETE_RECEIPT_LIST_SUCCESS,
  payload: resp,
});

// Party Wise Bank list
export const BankListAPI = (jsonBody) => ({
  type: BANK_LIST_API,
  jsonBody,
});

export const BankListAPISuccess = (resp) => ({
  type: BANK_LIST_API_SUCCESS,
  payload: resp,
});

export const ReceiptAndPaymentApiErrorAction = () => ({
  type: RECEIPT_AND_PAYMENT_API_ERROR_ACTION,
})