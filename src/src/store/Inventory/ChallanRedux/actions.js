import {

  DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  EDIT_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE_SUCCESS,
  GET_CHALLAN_LIST_PAGE,
  GET_CHALLAN_LIST_PAGE_SUCCESS,
  GET_GRN_ITEM_MODE_2,
  GET_GRN_ITEM_MODE_2_SUCCESS,
  GET_GRN_LIST_PAGE,
  GET_GRN_LIST_PAGE_SUCCESS,
  MAKE_CHALLAN_GET_API,
  MAKE_CHALLAN_GET_API_SUCCESS,
  POST_GRN_FROM_GRN_PAGE,
  POST_GRN_FROM_GRN_PAGE_SUCCESS,
  SET_CHALLAN_LIST_FILTERS,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
  UPDATE_GRN_ID_FROM_GRN_PAGE_SUCCESS
} from './actionType'


export const challanlistfilters = filter => ({
  type: SET_CHALLAN_LIST_FILTERS,
  payload: filter,
})

//get listpage api
export const getChallanListPage = (filters) => ({
  type: GET_CHALLAN_LIST_PAGE,
  filters,
});

export const getChallanListPageSuccess = (data) => ({
  type: GET_CHALLAN_LIST_PAGE_SUCCESS,
  payload: data,
});

export const makechallan = (id) => ({
  type: MAKE_CHALLAN_GET_API,
  id,
});

export const makechallanSuccess = (data) => ({
  type: MAKE_CHALLAN_GET_API_SUCCESS,
  payload: data,
});

export const deleteChallanId = (id) => ({
  type: DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  id,
});
export const deleteChallanIdSuccess = (data) => ({
  type: DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  payload: data,
});



