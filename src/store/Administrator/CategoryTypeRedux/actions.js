import {
  SAVE_CATEGORYTYPE_MASTER,
  SAVE_CATEGORYTYPE_MASTER_SUCCESS,
  DELETE_CATEGORY_TYPE_ID,
  DELETE_CATEGORY_TYPE_ID_SUCCESS,
  EDIT_CATEGORY_TYPE_ID,
  EDIT_CATEGORY_TYPE_ID_SUCCESS,
  GET_CATEGORY_TYPE_LIST,
  GET_CATEGORY_TYPE_LIST_SUCCESS,
  UPDATE_CATEGORY_TYPE_ID,
  UPDATE_CATEGORY_TYPE_ID_SUCCESS,
  CATEGORY_TYPE_API_ERROR_ACTION,
} from "./actionTypes";


export const getCategoryTypelist = () => ({// get List Action
  type: GET_CATEGORY_TYPE_LIST,
});

export const getCategoryTypelistSuccess = (pages) => ({// get List success
  type: GET_CATEGORY_TYPE_LIST_SUCCESS,
  payload: pages,
});

export const saveCategoryTypeMaster = (config = {}) => ({// save Action
  type: SAVE_CATEGORYTYPE_MASTER,
  config,
});

export const saveCategoryTypeMaster_Success = (resp) => ({// Save  success
  type: SAVE_CATEGORYTYPE_MASTER_SUCCESS,
  payload: resp,
});

export const editCategoryTypeID = (config = {}) => ({ // Edit Action 
  type: EDIT_CATEGORY_TYPE_ID,
  config,
});

export const editCategoryTypeIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_CATEGORY_TYPE_ID_SUCCESS,
  payload: editData,
});

export const updateCategoryTypeID = (config = {}) => ({// update  Action
  type: UPDATE_CATEGORY_TYPE_ID,
  config,
});

export const updateCategoryTypeIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_CATEGORY_TYPE_ID_SUCCESS,
  payload: resp,
})

export const delete_CategoryType_ID = (config = {}) => ({// Delete  Action
  type: DELETE_CATEGORY_TYPE_ID,
  config,
});

export const deleteCategoryTypeIDSuccess = (resp) => ({// Delete Success
  type: DELETE_CATEGORY_TYPE_ID_SUCCESS,
  payload: resp
});

export const categoryTypeApiErrorAction = () => ({
  type: CATEGORY_TYPE_API_ERROR_ACTION,
})

