import {
  GO_BUTTON_IMPORT_MASTER_MAP_ADD,
  GO_BUTTON_IMPORT_MASTER_MAP_ADD_SUCCESS,
  SAVE_IMPORT_MASTER_MAP,
  SAVE_IMPORT_MASTER_MAP_SUCCESS
} from "./actionType";


export const GoButton_ImportMasterMap = (config) => ({// Add page GO-Buuton Action
  type: GO_BUTTON_IMPORT_MASTER_MAP_ADD,
  config
});

export const GoButton_ImportMasterMap_Success = (list) => ({// get List success
  type: GO_BUTTON_IMPORT_MASTER_MAP_ADD_SUCCESS,
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




