import {

  DELETE_GRN_FOR_GRN_PAGE,
  DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  EDIT_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  GET_GRN_ITEM_MODE_2,
  GET_GRN_ITEM_MODE_2_SUCCESS,
  GET_GRN_LIST_PAGE,
  GET_GRN_LIST_PAGE_SUCCESS,
  SAVE_GRN_FROM_GRN_PAGE_ACTION,
  SAVE_GRN_FROM_GRN_PAGE_SUCCESS,
  SET_GRN_LIST_FILTERS,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
  UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS
} from './actionType'


export const grnlistfilters = filter => ({
  type: SET_GRN_LIST_FILTERS,
  payload: filter,
})


export const getGRN_itemMode2 = (data, pageMode, path) => ({
  type: GET_GRN_ITEM_MODE_2,
  data, pageMode, path
});

export const getGRN_itemMode2_Success = list => ({
  type: GET_GRN_ITEM_MODE_2_SUCCESS,
  payload: list,
})


//get listpage api
export const getGRNListPage = (config = {}) => ({
  type: GET_GRN_LIST_PAGE,
  config,
});

export const getGRNListPageSuccess = (resp) => ({
  type: GET_GRN_LIST_PAGE_SUCCESS,
  payload: resp,
});


export const saveGRNAction = (config = {}) => ({
  type: SAVE_GRN_FROM_GRN_PAGE_ACTION,
  config,
});
export const saveGRNSuccess = (msg) => ({
  type: SAVE_GRN_FROM_GRN_PAGE_SUCCESS,
  payload: msg
});

export const editGRNAction = (config = {}) => ({
  type: EDIT_GRN_FOR_GRN_PAGE,
  config ,
});
export const editGRNIdSuccess = (resp) => ({
  type: EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  payload: resp,
});

export const updateGRNId = (config = {}) => ({
  type: UPDATE_GRN_ID_FROM_GRN_PAGE,
  config,
});
export const updateGRNIdSuccess = (resp) => ({
  type: UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS,
  payload: resp,
});


export const deleteGRNId = (config = {}) => ({
  type: DELETE_GRN_FOR_GRN_PAGE,
  config ,
});
export const deleteGRNIdSuccess = (resp) => ({
  type: DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  payload: resp,
});



