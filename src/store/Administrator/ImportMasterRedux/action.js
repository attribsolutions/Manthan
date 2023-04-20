import {
  DELETE_EXCEL_IMPORT_LIST_ID,
  DELETE_EXCEL_IMPORT_LIST_ID_SUCCESS,
  EDIT_EXCEL_IMPORTMASTER_ID,
  EDIT_EXCEL_IMPORTMASTER_ID_SUCCESS,
  GET_EXCEL_IMPORT_LIST,
  GET_EXCEL_IMPORT_LIST_SUCCESS,
  GO_BUTTON_EXCEL_IMPORT_ADD,
  GO_BUTTON_EXCEL_IMPORT_ADD_SUCCESS,
  SAVE_EXCEL_IMPORT_MASTER,
  SAVE_EXCEL_IMPORT_MASTER_SUCCESS,
  UPDATE_EXCEL_IMPORTMASTER_ID,
  UPDATE_EXCEL_IMPORTMASTER_ID_SUCCESS
} from "./actionType";


export const GoButton_Excel_ImportAdd = (config) => ({// Add page GO-Buuton Action
  type: GO_BUTTON_EXCEL_IMPORT_ADD,
  config
});

export const GoButton_Excel_ImportAddSuccess = (list) => ({// get List success
  type: GO_BUTTON_EXCEL_IMPORT_ADD_SUCCESS,
  payload: list,
});


export const getExcel_ImportList = () => ({// get List Action
  type: GET_EXCEL_IMPORT_LIST,
});

export const getExcel_ImportListSuccess = (pages) => ({// get List success
  type: GET_EXCEL_IMPORT_LIST_SUCCESS,
  payload: pages,
});

export const saveExcel_ImportMaster = (config={}) => ({// save Action
  type: SAVE_EXCEL_IMPORT_MASTER,
  config,
});

export const saveExcel_ImportMaster_Success = (resp) => ({// Save  success
  type: SAVE_EXCEL_IMPORT_MASTER_SUCCESS,
  payload: resp,
});

export const editExcel_ImportID = (config = {}) => ({ // Edit Action 
  type: EDIT_EXCEL_IMPORTMASTER_ID,
  config,
});

export const editExcel_ImportIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_EXCEL_IMPORTMASTER_ID_SUCCESS,
  payload: editData,
});

export const updateExcel_ImportID = (config = {}) => ({// update  Action
  type: UPDATE_EXCEL_IMPORTMASTER_ID,
  config,
});

export const updateExcel_ImportIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_EXCEL_IMPORTMASTER_ID_SUCCESS,
  payload: resp,
})

export const delete_Excel_ImportList_ID = (config={}) => ({// Delete  Action
  type: DELETE_EXCEL_IMPORT_LIST_ID,
  config,
});

export const deleteExcel_ImportlistSuccess = (resp) => ({// Delete Success
  type: DELETE_EXCEL_IMPORT_LIST_ID_SUCCESS,
  payload: resp
});




