import {
  RECEIPT_GO_BUTTON_MASTER,
  RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  RECEIPT_MODE_API,
  RECEIPT_MODE_API_SUCCESS
} from "./actionType";

export const ReceiptGoButtonMaster = (jsonBody) => ({// save Action
  type: RECEIPT_GO_BUTTON_MASTER,
  jsonBody,
});

export const ReceiptGoButtonMaster_Success = (resp) => ({// Save  success
  type: RECEIPT_GO_BUTTON_MASTER_SUCCESS,
  payload: resp,
});

// Receipt Mode dropdown API
export const ReceiptModeAPI = (jsonBody) => ({// save Action
  type: RECEIPT_MODE_API,
  jsonBody,
});

export const ReceiptModeAPI_Success = (resp) => ({// Save  success
  type: RECEIPT_MODE_API_SUCCESS,
  payload: resp,
});
