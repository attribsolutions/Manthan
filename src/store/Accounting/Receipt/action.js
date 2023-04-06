import { RECEIPT_GO_BUTTON_MASTER, RECEIPT_GO_BUTTON_MASTER_SUCCESS } from "./actionType";

export const ReceiptGoButtonMaster =  (jsonBody) => ({// save Action
    type: RECEIPT_GO_BUTTON_MASTER,
    jsonBody,
  });
  
  export const ReceiptGoButtonMaster_Success = (resp) => ({// Save  success
    type: RECEIPT_GO_BUTTON_MASTER_SUCCESS,
    payload: resp,
  });
  