import {
  DELETE_IMPORT_FIELD_ADD,
  DELETE_IMPORT_FIELD_ADD_SUCCESS,
  EDIT_IMPORT_FIELD_ADD,
  EDIT_IMPORT_FIELD_ADD_SUCCESS,
  IMPORT_EXCEL_TYPE,
  IMPORT_EXCEL_TYPE_SUCCESS,
  POST_IMPORT_FIELD_ADD,
  POST_IMPORT_FIELD_ADD_SUCCESS,
  SAVE_IMPORT_FIELD_ADD,
  SAVE_IMPORT_FIELD_ADD_SUCCESS,
  UPDATE_IMPORT_FIELD_ADD,
  UPDATE_IMPORT_FIELD_ADD_SUCCESS,
  IMPORT_FIELD_ADD_API_ERROR_ACTION
} from "./actionType";


export const save_ImportFiledAdd = (config = {}) => ({// save Action
  type: SAVE_IMPORT_FIELD_ADD,
  config,
});

export const save_ImportFiledAdd_Success = (resp) => ({// Save  success
  type: SAVE_IMPORT_FIELD_ADD_SUCCESS,
  payload: resp,
});

export const post_ImportFiledAdd = (jsonBody) => ({// get List Action
  type: POST_IMPORT_FIELD_ADD,
  jsonBody,
});

export const post_ImportFiledAdd_Success = (resp) => ({// get List success
  type: POST_IMPORT_FIELD_ADD_SUCCESS,
  payload: resp,
});

export const edit_ImportFiledAdd = (config = {}) => ({ // Edit Action
  type: EDIT_IMPORT_FIELD_ADD,
  config,
});

export const edit_ImportFiledAdd_Success = (editData) => ({// Edit  Success
  type: EDIT_IMPORT_FIELD_ADD_SUCCESS,
  payload: editData,
});

export const update_ImportFiledAdd = (config = {}) => ({// update  Action
  type: UPDATE_IMPORT_FIELD_ADD,
  config,
});

export const update_ImportFiledAdd_Success = (resp) => ({ //Update Success
  type: UPDATE_IMPORT_FIELD_ADD_SUCCESS,
  payload: resp,
})

export const delete_ImportFiledAdd = (config = {}) => ({// Delete  Action
  type: DELETE_IMPORT_FIELD_ADD,
  config,
});

export const delete_ImportFiledAdd_Success = (resp) => ({// Delete Success
  type: DELETE_IMPORT_FIELD_ADD_SUCCESS,
  payload: resp
});

export const get_ImportExcelType = (config = {}) => ({
  type: IMPORT_EXCEL_TYPE,
  config,
});

export const get_ImportExcelType_Success = (resp) => ({
  type: IMPORT_EXCEL_TYPE_SUCCESS,
  payload: resp
});

export const ImportFieldAddApiErrorAction = () => ({
  type: IMPORT_FIELD_ADD_API_ERROR_ACTION,
})






