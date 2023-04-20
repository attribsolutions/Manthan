import { SAVE_SALES_RETURN_MASTER, SAVE_SALES_RETURN_MASTER_SUCCESS, INVOICE_NUMBER, INVOICE_NUMBER_SUCCESS } from "./actionType";

// Invoice number dropdown API
export const InvoiceNumber = (jsonBody) => ({
  type: INVOICE_NUMBER,
  jsonBody,
});

export const InvoiceNumberSuccess = resp => ({
  type: INVOICE_NUMBER_SUCCESS,
  payload: resp,
})

// ReturnItemAdd ** Add button API
export const saveSalesReturnMaster = (config = {}) => ({   
  type: SAVE_SALES_RETURN_MASTER,
  config,
});

export const saveSalesReturnMaster_Success = resp => ({       
  type: SAVE_SALES_RETURN_MASTER_SUCCESS,
  payload: resp,
})