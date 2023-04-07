import {
  DEPOSITOR_BANK_FILTER,
  DEPOSITOR_BANK_FILTER_SUCCESS,
  GET_RECEIPT_LIST_PAGE,
  GET_RECEIPT_LIST_PAGE_SUCCESS,
  RECEIPT_GO_BUTTON_MASTER,
  RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  RECEIPT_LIST_FILTERS,
  SAVE_RECEIPT_MASTER,
  SAVE_RECEIPT_MASTER_SUCCESS
} from "./actionType";

export const ReceiptGoButtonMaster = (jsonBody) => ({// save Action
  type: RECEIPT_GO_BUTTON_MASTER,
  jsonBody,
});

export const ReceiptGoButtonMaster_Success = (resp) => ({// Save  success
  type: RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  payload: resp,
});

export const DepositorBankFilter = (jsonBody) => ({// save Action
  type: DEPOSITOR_BANK_FILTER,
  jsonBody,
});

export const DepositorBankFilter_Success = (resp) => ({// Save  success
  type: DEPOSITOR_BANK_FILTER_SUCCESS,
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

export const getReceiptListPage = (config={}) => ({
  type: GET_RECEIPT_LIST_PAGE,
 config,
});

export const getReceiptListPageSuccess = (resp) => ({
  type: GET_RECEIPT_LIST_PAGE_SUCCESS,
  payload: resp,
});

export const Receiptlistfilters = filter => ({
  type: RECEIPT_LIST_FILTERS,
  payload: filter,
})
