import {

  DELETE_GRN_FOR_GRN_PAGE,
  DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  EDIT_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  MAKE_GRN_MODE_1_ACTION,
  MAKE_GRN_MODE_1_ACTION_SUCCESS,
  GET_GRN_LIST_PAGE,
  GET_GRN_LIST_PAGE_SUCCESS,
  SAVE_GRN_FROM_GRN_PAGE_ACTION,
  SAVE_GRN_FROM_GRN_PAGE_SUCCESS,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
  UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS,
  GRN_API_ERROR_ACTION
} from './actionType'


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
  config,
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
  config,
});
export const deleteGRNIdSuccess = (resp) => ({
  type: DELETE_GRN_FOR_GRN_PAGE_SUCCESS,
  payload: resp,
});


export const makeGRN_Mode_1Action = (config = {}) => ({
  type: MAKE_GRN_MODE_1_ACTION,
  config
});

export const makeGRN_Mode_1ActionSuccess = list => ({
  type: MAKE_GRN_MODE_1_ACTION_SUCCESS,
  payload: list,
})


export const GrnApiErrorAction = () => ({
  type: GRN_API_ERROR_ACTION,
})



