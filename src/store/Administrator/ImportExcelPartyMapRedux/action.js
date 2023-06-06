import {
  INVOICE_EXCEL_UPLOAD_SAVE,
  INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  SAVE_IMPORT_EXCEL_PARTY_MAP,
  SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS
} from "./actionType";


export const GoButton_ImportExcelPartyMap = (config) => ({// Add page GO-Buuton Action
  type: GO_BUTTON_IMPORT_EXCEL_PARTY_MAP,
  config
});

export const GoButton_ImportExcelPartyMap_Success = (list) => ({// get List success
  type: GO_BUTTON_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  payload: list,
});

export const save_ImportExcelPartyMap = (config = {}) => ({// save Action
  type: SAVE_IMPORT_EXCEL_PARTY_MAP,
  config,
});

export const save_ImportExcelPartyMap_Sucess = (resp) => ({// Save  success
  type: SAVE_IMPORT_EXCEL_PARTY_MAP_SUCCESS,
  payload: resp,
});

export const InvoiceExcelUpload_save_action = (config = {}) => ({// save Action
  type: INVOICE_EXCEL_UPLOAD_SAVE,
  config,
});

export const InvoiceExcelUpload_save_Success = (resp) => ({// Save  success
  type: INVOICE_EXCEL_UPLOAD_SAVE_SUCCESS,
  payload: resp,
});



