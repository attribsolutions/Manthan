import { ADD_BUTTON_FOR_SALES_RETURN, ADD_BUTTON_FOR_SALES_RETURN_SUCCESS, INVOICE_NUMBER, INVOICE_NUMBER_SUCCESS } from "./actionType";

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
export const addButton_for_SalesReturn = (ItemID) => ({   // After Supplier Select Item List API
  type: ADD_BUTTON_FOR_SALES_RETURN,
  ItemID,
});

export const addButton_for_SalesReturn_Success = data => ({        // After Supplier Select Item List API success
  type: ADD_BUTTON_FOR_SALES_RETURN_SUCCESS,
  payload: data,
})