import {
  EXCEL_UPLOAD_SAVE,
  EXCEL_UPLOAD_SAVE_SUCCESS,
  GO_BUTTON_IMPORT_MASTER_MAP,
  GO_BUTTON_IMPORT_MASTER_MAP_SUCCESS,
  SAVE_IMPORT_MASTER_MAP,
  SAVE_IMPORT_MASTER_MAP_SUCCESS
} from "./actionType";


export const GoButton_ImportMasterMap = (config) => ({// Add page GO-Buuton Action
  type: GO_BUTTON_IMPORT_MASTER_MAP,
  config
});

export const GoButton_ImportMasterMap_Success = (list) => ({// get List success
  type: GO_BUTTON_IMPORT_MASTER_MAP_SUCCESS,
  payload: list,
});

export const save_ImportMasterMap = (config = {}) => ({// save Action
  type: SAVE_IMPORT_MASTER_MAP,
  config,
});

export const save_ImportMasterMap_Success = (resp) => ({// Save  success
  type: SAVE_IMPORT_MASTER_MAP_SUCCESS,
  payload: resp,
});

export const ExcelUpload_save_action = (config = {}) => ({// save Action
  type: EXCEL_UPLOAD_SAVE,
  config,
});

export const ExcelUpload_save_action_Success = (resp) => ({// Save  success
  type: EXCEL_UPLOAD_SAVE_SUCCESS,
  payload: resp,
});



