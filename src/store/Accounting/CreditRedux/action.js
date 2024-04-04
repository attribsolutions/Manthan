import {
  BULK_CREDITNOTE_DELETE_ID,
  BULK_CREDITNOTE_DELETE_ID_SUCCESS,
  CANCLE_CREDIT_DEBIT_E_INVOICE_ACTION,
  CANCLE_CREDIT_DEBIT_E_INVOICE_ACTION_SUCCESS,
  CREDITDEBIT_TYPE,
  CREDITDEBIT_TYPE_SUCCESS,
  CREDIT_DEBIT_API_ERROR_ACTION,
  DELETE_CREDIT_LIST_ID,
  DELETE_CREDIT_LIST_ID_SUCCESS,
  EDIT_CREDIT_LIST_ID,
  EDIT_CREDIT_LIST_ID_SUCCESS,
  GET_CREDIT_LIST,
  GET_CREDIT_LIST_SUCCESS,
  INVOICE_RETURN_ID,
  INVOICE_RETURN_ID_SUCCESS,
  RECEIPT_NUMBER_LIST,
  RECEIPT_NUMBER_LIST_SUCCESS,
  SAVE_CREDIT,
  SAVE_CREDIT_SUCCESS,
  UPLOADED_CREDIT_DEBIT_E_INVOICE_ACTION,
  UPLOADED_CREDIT_DEBIT_E_INVOICE_ACTION_SUCCESS,

} from "./actionType";

export const GetCreditList = (data) => ({// get List Action
  type: GET_CREDIT_LIST,
  data
});

export const GetCreditListSuccess = (resp) => ({// get List success
  type: GET_CREDIT_LIST_SUCCESS,
  payload: resp,
});

export const saveCredit = (config = {}) => ({// save Action
  type: SAVE_CREDIT,
  config,
});

export const saveCredit_Success = (resp) => ({// Save  success
  type: SAVE_CREDIT_SUCCESS,
  payload: resp,
});

export const CredietDebitType = (data) => ({ // Edit Action 
  type: CREDITDEBIT_TYPE,
  data,
});

export const CredietDebitTypeSuccess = (resp) => ({// Edit  Success
  type: CREDITDEBIT_TYPE_SUCCESS,
  payload: resp,
});

export const Edit_CreditList_ID = (config = {}) => ({// Delete  Action
  type: EDIT_CREDIT_LIST_ID,
  config,
});

export const EditCreditlistSuccess = (resp) => ({// Delete Success
  type: EDIT_CREDIT_LIST_ID_SUCCESS,
  payload: resp
});

export const Invoice_Return_ID = (id) => ({// Delete  Action
  type: INVOICE_RETURN_ID,
  id,
});

export const Invoice_Return_ID_Success = (resp) => ({// Delete Success
  type: INVOICE_RETURN_ID_SUCCESS,
  payload: resp
});

export const delete_CreditList_ID = (config = {}) => ({// Delete  Action
  type: DELETE_CREDIT_LIST_ID,
  config,
});

export const deleteCreditlistSuccess = (resp) => ({// Delete Success
  type: DELETE_CREDIT_LIST_ID_SUCCESS,
  payload: resp
});


export const bulk_CreditNote_delete_ID = (config = {}) => ({//  Bulk Credit Note Delete  Action
  type: BULK_CREDITNOTE_DELETE_ID,
  config,
});

export const bulk_CreditNote_delete_ID_Success = (resp) => ({//  Bulk Credit Note Delete Success
  type: BULK_CREDITNOTE_DELETE_ID_SUCCESS,
  payload: resp
});

// Receipt No. dropdown Api for debit master page.
export const Receipt_No_List = (jsonBody) => ({// Delete  Action
  type: RECEIPT_NUMBER_LIST,
  jsonBody,
});

export const Receipt_No_List_Success = (resp) => ({// Delete Success
  type: RECEIPT_NUMBER_LIST_SUCCESS,
  payload: resp
});

export const CreditDebitApiErrorAction = () => ({
  type: CREDIT_DEBIT_API_ERROR_ACTION,
})


//**************************** E-Invoice-Credit_Debit (upload ,cancel) ***************************************/

export const Uploaded_Credit_Debit_EInvoiceAction = (config) => ({
  type: UPLOADED_CREDIT_DEBIT_E_INVOICE_ACTION,
  config
});

export const Uploaded_Credit_Debit_EInvoiceSuccess = (data) => ({
  type: UPLOADED_CREDIT_DEBIT_E_INVOICE_ACTION_SUCCESS,
  payload: data,
});

export const Cancel_Credit_Debit_EInvoiceAction = (config) => ({
  type: CANCLE_CREDIT_DEBIT_E_INVOICE_ACTION,
  config
});

export const Cancel_Credit_Debit_EInvoiceSuccess = (data) => ({
  type: CANCLE_CREDIT_DEBIT_E_INVOICE_ACTION_SUCCESS,
  payload: data,
});
