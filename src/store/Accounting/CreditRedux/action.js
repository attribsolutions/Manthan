import {
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
