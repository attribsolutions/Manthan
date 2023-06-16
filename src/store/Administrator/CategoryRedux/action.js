import {
  SAVE_CATEGORY_MASTER,
  SAVE_CATEGORY_MASTER_SUCCESS,
  DELETE_CATEGORY_ID,
  DELETE_CATEGORY_ID_SUCCESS,
  EDIT_CATEGORY_ID,
  EDIT_CATEGORY_ID_SUCCESS,
  GET_CATEGORY_LIST,
  GET_CATEGORY_LIST_SUCCESS,
  UPDATE_CATEGORY_ID,
  UPDATE_CATEGORY_ID_SUCCESS,
  CATEGORY_API_ERROR_ACTION,
} from "./actionTypes";


export const getCategorylist = () => ({// get List Action
  type: GET_CATEGORY_LIST,
});

export const getCategorylistSuccess = (pages) => ({// get List success
  type: GET_CATEGORY_LIST_SUCCESS,
  payload: pages,
});

export const saveCategoryMaster = (config = {}) => ({// save Action
  type: SAVE_CATEGORY_MASTER,
  config,
});

export const saveCategoryMaster_Success = (resp) => ({// Save  success
  type: SAVE_CATEGORY_MASTER_SUCCESS,
  payload: resp,
});

export const editCategoryID = (config = {}) => ({ // Edit Action 
  type: EDIT_CATEGORY_ID,
  config,
});

export const editCategoryIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_CATEGORY_ID_SUCCESS,
  payload: editData,
});

export const updateCategoryID = (config = {}) => ({// update  Action
  type: UPDATE_CATEGORY_ID,
  config,
});

export const updateCategoryIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_CATEGORY_ID_SUCCESS,
  payload: resp,
})

export const delete_Category_ID = (config = {}) => ({// Delete  Action
  type: DELETE_CATEGORY_ID,
  config,
});

export const deleteCategoryIDSuccess = (resp) => ({// Delete Success
  type: DELETE_CATEGORY_ID_SUCCESS,
  payload: resp
});


export const categoryApiErrorAction = () => ({
  type: CATEGORY_API_ERROR_ACTION,
})

