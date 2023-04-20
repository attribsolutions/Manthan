import {
  DELETE_IMPORT_FIELD_ADD,
  DELETE_IMPORT_FIELD_ADD_SUCCESS,
  EDIT_IMPORT_FIELD_ADD,
  EDIT_IMPORT_FIELD_ADD_SUCCESS,
  GET_IMPORT_FIELD_ADD,
  GET_IMPORT_FIELD_ADD_SUCCESS,
  SAVE_IMPORT_FIELD_ADD,
  SAVE_IMPORT_FIELD_ADD_SUCCESS,
  UPDATE_IMPORT_FIELD_ADD,
  UPDATE_IMPORT_FIELD_ADD_SUCCESS
} from "./actionType";



export const save_ImportFiledAdd = (config = {}) => ({// save Action
  type: SAVE_IMPORT_FIELD_ADD,
  config,
});

export const save_ImportFiledAdd_Success = (resp) => ({// Save  success
  type: SAVE_IMPORT_FIELD_ADD_SUCCESS,
  payload: resp,
});

export const get_ImportFiledAdd = () => ({// get List Action
  type: GET_IMPORT_FIELD_ADD,
});

export const get_ImportFiledAdd_Success = (pages) => ({// get List success
  type: GET_IMPORT_FIELD_ADD_SUCCESS,
  payload: pages,
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

export const delete_ImportFiledAdd = (config={}) => ({// Delete  Action
  type: DELETE_IMPORT_FIELD_ADD,
  config,
});

export const delete_ImportFiledAdd_Success = (resp) => ({// Delete Success
  type: DELETE_IMPORT_FIELD_ADD_SUCCESS,
  payload: resp
});




