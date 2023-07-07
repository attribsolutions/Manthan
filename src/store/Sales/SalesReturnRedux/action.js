import {
  SAVE_SALES_RETURN_MASTER,
  SAVE_SALES_RETURN_MASTER_SUCCESS,
  INVOICE_NUMBER,
  INVOICE_NUMBER_SUCCESS,
  SALES_RETURN_LIST_API,
  SALES_RETURN_LIST_API_SUCCESS,
  DELETE_SALES_RETURN_ID,
  DELETE_SALES_RETURN_ID_SUCCESS,
  SALES_RUTURN_API_ERROR_ACTION,
  SALES_RETURN_ADD_BUTTON_ACTION,
  SALES_RETURN_ADD_BUTTON_ACTION_SUCCESS
} from "./actionType";


export const SalesReturnAddBtn_Action = config => ({
  type: SALES_RETURN_ADD_BUTTON_ACTION,
  config
})

export const SalesReturnAddBtn_Action_Succcess = (items) => ({
  type: SALES_RETURN_ADD_BUTTON_ACTION_SUCCESS,
  payload: items,
});

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

// Sales Return List api
export const salesReturnListAPI = (filters) => ({
  type: SALES_RETURN_LIST_API,
  filters,
});

export const salesReturnListAPISuccess = (resp) => ({
  type: SALES_RETURN_LIST_API_SUCCESS,
  payload: resp,
});

// Delete Sales Return api
export const delete_SalesReturn_Id = (config = {}) => ({
  type: DELETE_SALES_RETURN_ID,
  config,
});

export const delete_SalesReturn_Id_Succcess = (resp) => ({
  type: DELETE_SALES_RETURN_ID_SUCCESS,
  payload: resp,
});


export const SalesReturnApiErrorAction = () => ({
  type: SALES_RUTURN_API_ERROR_ACTION,
})