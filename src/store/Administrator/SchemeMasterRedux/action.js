import {
  DELETE_SCHEME_LIST_ID,
  DELETE_SCHEME_LIST_ID_SUCCESS,
  EDIT_SCHEMEMASTER_ID,
  EDIT_SCHEMEMASTER_ID_SUCCESS,
  GET_SCHEME_LIST,
  GET_SCHEME_LIST_SUCCESS,
  SCHEME_API_ERROR_ACTION,
  SAVE_SCHEME_MASTER,
  SAVE_SCHEME_MASTER_SUCCESS,
  UPDATE_SCHEMEMASTER_ID,
  UPDATE_SCHEMEMASTER_ID_SUCCESS
} from "./actionType";


export const getSchemeList = () => ({// get List Action
  type: GET_SCHEME_LIST,
});

export const getSchemeListSuccess = (pages) => ({// get List success
  type: GET_SCHEME_LIST_SUCCESS,
  payload: pages,
});

export const saveSchemeMaster = (config = {}) => ({// save Action
  type: SAVE_SCHEME_MASTER,
  config,
});

export const saveSchemeMaster_Success = (resp) => ({// Save  success
  type: SAVE_SCHEME_MASTER_SUCCESS,
  payload: resp,
});

export const editSchemeID = (config = {}) => ({ // Edit Action 
  type: EDIT_SCHEMEMASTER_ID,
  config,
});

export const editSchemeIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_SCHEMEMASTER_ID_SUCCESS,
  payload: editData,
});

export const updateSchemeID = (config = {}) => ({// update  Action
  type: UPDATE_SCHEMEMASTER_ID,
  config,
});

export const updateSchemeIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_SCHEMEMASTER_ID_SUCCESS,
  payload: resp,
})

export const delete_SchemeList_ID = (config = {}) => ({// Delete  Action
  type: DELETE_SCHEME_LIST_ID,
  config,
});

export const deleteSchemelistSuccess = (resp) => ({// Delete Success
  type: DELETE_SCHEME_LIST_ID_SUCCESS,
  payload: resp
});


export const SchemeApiErrorAction = () => ({
  type: SCHEME_API_ERROR_ACTION,
});




