import {

  DELETE_PRODUCTION_FOR_PRODUCTION_PAGE,
  DELETE_PRODUCTION_ID,
  DELETE_PRODUCTION_SUCCESS,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  GET_PRODUCTION_ITEM_MODE_2,
  GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  GET_PRODUCTION_LIST_PAGE,
  GET_PRODUCTION_LIST_PAGE_SUCCESS,
  GET_UNIT_ID_FOR_PRODUNCTION,
  GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  SET_PRODUCTION_LIST_FILTERS,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS
} from './actionType'

export const Productionlistfilters = filter => ({
  type: SET_PRODUCTION_LIST_FILTERS,
  payload: filter,
})

//get listpage api
export const getProduction_Mode2 = (data, pageMode, path) => ({
  type: GET_PRODUCTION_ITEM_MODE_2,
  data, pageMode, path,
});

export const getProduction_Mode2_Success = (data) => ({
  type: GET_PRODUCTION_ITEM_MODE_2_SUCCESS,
  payload: data,
});


export const post_Production = (data) => ({
  type: POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  data
});
export const post_ProductionSuccess = (msg) => ({
  type: POST_PRODUCTION_FROM_PRODUCTION_PAGE_SUCCESS,
  payload: msg
});

export const getProductionListPage = (filters) => ({
  type: GET_PRODUCTION_LIST_PAGE,
  filters,
});

export const getProductionistPageSuccess = (data) => ({
  type: GET_PRODUCTION_LIST_PAGE_SUCCESS,
  payload: data,
});


export const edit_ProductionId = (id, pageMode) => ({
  type: EDIT_PRODUCTION_FOR_PRODUCTION_PAGE,
  id, pageMode,
});
export const edit_ProductionIdSuccess = (data) => ({
  type: EDIT_PRODUCTION_FOR_PRODUCTION_PAGE_SUCCESS,
  payload: data,
});

export const update_ProductionId = (data, id) => ({
  type: UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
  data, id,
});
export const update_ProductionIdSuccess = (data) => ({
  type: UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE_SUCCESS,
  payload: data,
});


export const delete_ProductionId = (id) => ({
  type: DELETE_PRODUCTION_ID,
  id,
});
export const delete_ProductionIdSuccess = (data) => ({
  type: DELETE_PRODUCTION_SUCCESS,
  payload: data,
});

//DesignationID  dropdown
export const getUnitIDForProdunction = (data) => ({
  type: GET_UNIT_ID_FOR_PRODUNCTION,
  data,
});
export const getUnitIDForProdunctionSuccess = (unitID) => ({
  type: GET_UNIT_ID_FOR_PRODUNCTION_SUCCESS,
  payload: unitID,
});


