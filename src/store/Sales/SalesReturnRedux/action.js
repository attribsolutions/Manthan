<<<<<<< HEAD
import { ADD_BUTTON_FOR_SALES_RETURN, ADD_BUTTON_FOR_SALES_RETURN_SUCCESS, INVOICE_NUMBER, INVOICE_NUMBER_SUCCESS } from "./actionType";
=======
import {
  SAVE_SALES_RETURN_MASTER,
  SAVE_SALES_RETURN_MASTER_SUCCESS,
  INVOICE_NUMBER,
  INVOICE_NUMBER_SUCCESS,
  SALES_RETURN_LIST_API,
  SALES_RETURN_LIST_API_SUCCESS,
  DELETE_SALES_RETURN_ID,
  DELETE_SALES_RETURN_ID_SUCCESS
} from "./actionType";
>>>>>>> NewCommon

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

<<<<<<< HEAD
export const addButton_for_SalesReturn_Success = data => ({        // After Supplier Select Item List API success
  type: ADD_BUTTON_FOR_SALES_RETURN_SUCCESS,
  payload: data,
})
=======
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
>>>>>>> NewCommon
