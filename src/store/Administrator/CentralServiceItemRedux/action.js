import {
  CENTRAL_SERVICE_ITEM_API_ERROR_ACTION,
  DELETE_CENTRAL_SERVICE_ITEM_LIST_ID,
  DELETE_CENTRAL_SERVICE_ITEM_LIST_ID_SUCCESS,
  EDIT_CENTRAL_SERVICE_ITEM_ID,
  EDIT_CENTRAL_SERVICE_ITEM_ID_SUCCESS,
  GET_CENTRAL_SERVICE_ITEM_LIST,
  GET_CENTRAL_SERVICE_ITEM_LIST_SUCCESS,
  SAVE_CENTRAL_SERVICE_ITEM,
  SAVE_CENTRAL_SERVICE_ITEM_SUCCESS,
  UPDATE_CENTRAL_SERVICE_ITEM_ID,
  UPDATE_CENTRAL_SERVICE_ITEM_ID_SUCCESS,
} from "./actionType";


export const getCentralServiceItemList = () => ({// get List Action
  type: GET_CENTRAL_SERVICE_ITEM_LIST,
});

export const getCentralServiceItemSuccess = (pages) => ({// get List success
  type: GET_CENTRAL_SERVICE_ITEM_LIST_SUCCESS,
  payload: pages,
});

export const saveCentralServiceItem = (config = {}) => ({// save Action
  type: SAVE_CENTRAL_SERVICE_ITEM,
  config,
});

export const saveCentralServiceItem_Success = (resp) => ({// Save  success
  type: SAVE_CENTRAL_SERVICE_ITEM_SUCCESS,
  payload: resp,
});

export const editCentralServiceItemID = (config = {}) => ({ // Edit Action 
  type: EDIT_CENTRAL_SERVICE_ITEM_ID,
  config,
});

export const editCentralServiceItemSuccess = (editData) => ({// Edit  Success
  type: EDIT_CENTRAL_SERVICE_ITEM_ID_SUCCESS,
  payload: editData,
});

export const updateCentralServiceItemID = (config = {}) => ({// update  Action
  type: UPDATE_CENTRAL_SERVICE_ITEM_ID,
  config,
});

export const updateCentralServiceItemIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_CENTRAL_SERVICE_ITEM_ID_SUCCESS,
  payload: resp,
})

export const delete_CentralServiceItemList_ID = (config = {}) => ({// Delete  Action
  type: DELETE_CENTRAL_SERVICE_ITEM_LIST_ID,
  config,
});

export const deleteCentralServiceItemListSuccess = (resp) => ({// Delete Success
  type: DELETE_CENTRAL_SERVICE_ITEM_LIST_ID_SUCCESS,
  payload: resp
});


export const CentralServiceItemApiErrorAction = () => ({
  type: CENTRAL_SERVICE_ITEM_API_ERROR_ACTION,
});




