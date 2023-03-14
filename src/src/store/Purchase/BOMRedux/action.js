import {
  DELETE_BOM_LIST_PAGE,
  DELETE_BOM_LIST_PAGE_SUCCESS,
  EDIT_BOM_LIST_ID,
  EDIT_BOM_LIST_ID_SUCCESS,
  GET_BOM_LIST_PAGE,
  GET_BOM_LIST_PAGE_SUCCESS,
  GET_ITEM_UNITS_DROPDOWN_API,
  GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
  SAVE_BOM_MASTER, SAVE_BOM_MASTER_SUCCESS,
  UPDATE_BOM_LIST,
  UPDATE_BOM_LIST_SUCCESS,
  BOM_LIST_FILTERS
} from "./actionTypes";



export const BOMlistfilters = filter => ({
  type:BOM_LIST_FILTERS,
  payload: filter,
})


// post api
export const postBOM = (data) => ({
  type: SAVE_BOM_MASTER,
  data,
});

export const postBOMSuccess = (data) => ({
  type: SAVE_BOM_MASTER_SUCCESS,
  payload: data,
});

// Get Item Units
export const GetItemUnitsDrodownAPI = (data) => ({
  type: GET_ITEM_UNITS_DROPDOWN_API,
  data,

});
export const GetItemUnitsDrodownAPISuccess = (data) => ({
  type: GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
  payload: data,
});

//get listpage api
export const getBOMListPage = (filters) => ({
  type: GET_BOM_LIST_PAGE,
  filters,
});

export const getBOMListPageSuccess = (data) => ({
  type: GET_BOM_LIST_PAGE_SUCCESS,
  payload: data,
});

// edit api
export const editBOMList = (id1, pageMode) => ({
  type: EDIT_BOM_LIST_ID,
  id1, pageMode
})

export const editBOMListSuccess = (editData) => ({
  type: EDIT_BOM_LIST_ID_SUCCESS,
  payload: editData,
})

export const updateBOMList = (data, id1) => ({
  type: UPDATE_BOM_LIST,
  data, id1,
});
export const updateBOMListSuccess = (data) => ({
  type: UPDATE_BOM_LIST_SUCCESS,
  payload: data,
});

export const deleteBOMId = (id) => ({
  type: DELETE_BOM_LIST_PAGE,
  id,
});
export const deleteBOMIdSuccess = (data) => ({
  type: DELETE_BOM_LIST_PAGE_SUCCESS,
  payload: data,
});
