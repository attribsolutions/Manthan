
import {
  SAVE_ROUTES_MASTER,
  SAVE_ROUTES_MASTER_API_SUCCESS,
  DELETE_ROUTES_ID,
  DELETE_ROUTES_ID_SUCCESS,
  EDIT_ROUTES_ID,
  EDIT_ROUTES_ID_SUCCESS,
  GET_ROUTES_LIST,
  GET_ROUTES_LIST_SUCCESS,
  UPDATE_ROUTES_ID,
  UPDATE_ROUTES_ID_SUCCESS,
  ROUTES_API_ERROR_ACTION
} from "./actionTypes";

export const GetRoutesList = (jsonBody) => ({
  type: GET_ROUTES_LIST,
  jsonBody,
});

export const GetRoutesListSuccess = (resp) => ({
  type: GET_ROUTES_LIST_SUCCESS,
  payload: resp,
});

export const SaveRoutesMaster = (config = {}) => ({
  type: SAVE_ROUTES_MASTER,
  config,
});

export const SaveRoutesMasterSuccess = (resp) => ({
  type: SAVE_ROUTES_MASTER_API_SUCCESS,
  payload: resp,
});

export const editRoutesID = (config = {}) => ({
  type: EDIT_ROUTES_ID,
  config,
})

export const editRoutesIDSuccess = (resp) => ({
  type: EDIT_ROUTES_ID_SUCCESS,
  payload: resp,
})

export const updateRoutesID = (config = {}) => ({
  type: UPDATE_ROUTES_ID,
  config,
})

export const updateRoutesIDSuccess = (resp) => ({
  type: UPDATE_ROUTES_ID_SUCCESS,
  payload: resp,
})

export const deleteRoutesID = (config = {}) => ({
  type: DELETE_ROUTES_ID,
  config,
});

export const deleteRoutesID_Success = (resp) => ({
  type: DELETE_ROUTES_ID_SUCCESS,
  payload: resp
});

export const RouteApiErrorAction = () => ({
  type: ROUTES_API_ERROR_ACTION,
})

