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
  BOM_LIST_FILTERS,
  BOM_API_ERROR_ACTION
} from "./actionTypes";

// export const BOMlistfilters = filter => ({
//   type:BOM_LIST_FILTERS,
//   payload: filter,
// })

export const saveBOMMaster = (config={}) => ({ // Post action
  type: SAVE_BOM_MASTER,
  config,
});

export const saveBOMMasterSuccess = (resp) => ({ // post Success
  type: SAVE_BOM_MASTER_SUCCESS,
  payload: resp,
});

//get listpage api
export const getBOMListPage = (filters) => ({
  type: GET_BOM_LIST_PAGE,
  filters,
});

export const getBOMListPageSuccess = (resp) => ({
  type: GET_BOM_LIST_PAGE_SUCCESS,
  payload: resp,
});

// edit api
export const editBOMList = (config={}) => ({
  type: EDIT_BOM_LIST_ID,
  config,
})

export const editBOMListSuccess = (resp) => ({
  type: EDIT_BOM_LIST_ID_SUCCESS,
  payload: resp,
})

export const updateBOMList = (config={}) => ({
  type: UPDATE_BOM_LIST,
  config,
});

export const updateBOMListSuccess = (resp) => ({
  type: UPDATE_BOM_LIST_SUCCESS,
  payload: resp,
});

export const deleteBOMId = (config={}) => ({
  type: DELETE_BOM_LIST_PAGE,
  config,
});

export const deleteBOMIdSuccess = (resp) => ({
  type: DELETE_BOM_LIST_PAGE_SUCCESS,
  payload: resp,
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

export const BOMApiErrorAction = () => ({
  type: BOM_API_ERROR_ACTION,
})