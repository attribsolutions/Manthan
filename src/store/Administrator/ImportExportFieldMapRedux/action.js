import {
  GO_BUTTON_IMPORT_FIELD_MAP_ADD,
  GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS,
  IMPORT_FIELD_MAP_API_ERROR_ACTION,
  SAVE_IMPORT_FIELD_MAP,
  SAVE_IMPORT_FIELD_MAP_SUCCESS
} from "./actionType";


export const GoButton_ImportFiledMap_Add = (config) => ({// Add page GO-Buuton Action
  type: GO_BUTTON_IMPORT_FIELD_MAP_ADD,
  config
});

export const GoButton_ImportFiledMap_AddSuccess = (list) => ({// get List success
  type: GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS,
  payload: list,
});

export const save_ImportFiledMap = (config = {}) => ({
  type: SAVE_IMPORT_FIELD_MAP,
  config,
});

export const save_ImportFiledMap_Success = (resp) => ({
  type: SAVE_IMPORT_FIELD_MAP_SUCCESS,
  payload: resp,
});


export const ImportFiledMap_ApiErrorAction = () => ({
  type: IMPORT_FIELD_MAP_API_ERROR_ACTION,
});

