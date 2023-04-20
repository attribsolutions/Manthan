import {
  GO_BUTTON_IMPORT_FIELD_MAP_ADD,
  GO_BUTTON_IMPORT_FIELD_MAP_ADD_SUCCESS,
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

export const save_ImportFiledMap = (config = {}) => ({// save Action
  type: SAVE_IMPORT_FIELD_MAP,
  config,
});

export const save_ImportFiledMap_Success = (resp) => ({// Save  success
  type: SAVE_IMPORT_FIELD_MAP_SUCCESS,
  payload: resp,
});

// export const get_ImportFiledMap_List = () => ({// get List Action
//   type: GET_EXCEL_IMPORT_LIST,
// });

// export const get_ImportFiledMap_ListSuccess = (pages) => ({// get List success
//   type: GET_IMPORT_FIELD_MAP_LIST_SUCCESS,
//   payload: pages,
// });



// export const edit_ImportFiledMap = (config = {}) => ({ // Edit Action
//   type: EDIT_EXCEL_IMPORTMASTER,
//   config,
// });

// export const edit_ImportFiledMap_Success = (editData) => ({// Edit  Success
//   type: EDIT_EXCEL_IMPORTMASTER__SUCCESS,
//   payload: editData,
// });

// export const update_ImportFiledMap = (config = {}) => ({// update  Action
//   type: UPDATE_EXCEL_IMPORTMASTER,
//   config,
// });

// export const update_ImportFiledMap_Success = (resp) => ({ //Update Success
//   type: UPDATE_EXCEL_IMPORTMASTER_ID_SUCCESS,
//   payload: resp,
// })

// export const delete_ImportFiledMap_List = (config={}) => ({// Delete  Action
//   type: DELETE_EXCEL_IMPORT_LIST,
//   config,
// });

// export const delete_ImportFiledMap_listSuccess = (resp) => ({// Delete Success
//   type: DELETE_EXCEL_IMPORT_LIST_SUCCESS,
//   payload: resp
// });




