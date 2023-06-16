
import {
  SAVE_SALES_MAN_MASTER,
  SAVE_SALES_MAN_MASTER_SUCCESS,
  DELETE_SALESMAN_ID,
  DELETE_SALESMAN_ID_SUCCESS,
  EDIT_SALESMAN_ID,
  EDIT_SALESMAN_ID_SUCCESS,
  GET_SALESMAN_LIST,
  GET_SALESMAN_LIST_SUCCESS,
  UPDATE_SALESMAN_ID,
  UPDATE_SALESMAN_ID_SUCCESS,
  SALESMAN_API_ERROR_ACTION
} from "./actionTypes";

export const saveSalesManMaster = (config = {}) => ({
  type: SAVE_SALES_MAN_MASTER,
  config,
});

export const saveSalesManMasterSuccess = (resp) => ({
  type: SAVE_SALES_MAN_MASTER_SUCCESS,
  payload: resp,
});

export const getSalesManlist = (jsonBody) => ({
  type: GET_SALESMAN_LIST,
  jsonBody,
});

export const getSalesManlistSuccess = (resp) => ({
  type: GET_SALESMAN_LIST_SUCCESS,
  payload: resp,
});

export const editSalesManID = (config = {}) => ({
  type: EDIT_SALESMAN_ID,
  config,
})

export const editSalesManIDSuccess = (resp) => ({
  type: EDIT_SALESMAN_ID_SUCCESS,
  payload: resp,
})

export const updateSalesManID = (config = {}) => ({
  type: UPDATE_SALESMAN_ID,
  config,
})

export const updateSalesManIDSuccess = (resp) => ({
  type: UPDATE_SALESMAN_ID_SUCCESS,
  payload: resp,
})

export const deleteSalesManID = (config = {}) => ({
  type: DELETE_SALESMAN_ID,
  config,

});
export const deleteSalesManID_Success = (resp) => ({
  type: DELETE_SALESMAN_ID_SUCCESS,
  payload: resp
});

export const SalesManApiErrorAction = () => ({
  type: SALESMAN_API_ERROR_ACTION,
})