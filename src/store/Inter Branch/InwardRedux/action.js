import {
  DELETE_INWARD_LIST_PAGE,
  DELETE_INWARD_LIST_PAGE_SUCCESS,
  GET_INWARD_LIST_PAGE,
  GET_INWARD_LIST_PAGE_SUCCESS,
  INWARD_LIST_FILTERS,
  MAKE_INWARD,
  MAKE_INWARD_SUCCESS,
  POST_INWARD,
  POST_INWARD_SUCCESS
} from "./actionType";

export const Inwardlistfilters = filter => ({
  type: INWARD_LIST_FILTERS,
  payload: filter,
})

// post api
export const postInward = (data) => ({
  type: POST_INWARD,
  data,
});

export const postInwardSuccess = (data) => ({
  type: POST_INWARD_SUCCESS,
  payload: data,
});

//Inward listpage api
export const getInwardListPage = (filters) => ({
  type: GET_INWARD_LIST_PAGE,
  filters,
});

export const getInwardListPageSuccess = (data) => ({
  type: GET_INWARD_LIST_PAGE_SUCCESS,
  payload: data,
});

export const deleteInwardId = (id) => ({
  type: DELETE_INWARD_LIST_PAGE,
  id,
});
export const deleteInwardIdSuccess = (data) => ({
  type: DELETE_INWARD_LIST_PAGE_SUCCESS,
  payload: data,
});

// Make Inward api
export const makeInward = (id) => ({
  type: MAKE_INWARD,
  id,
});

export const makeInwardSuccess = (data) => ({
  type: MAKE_INWARD_SUCCESS,
  payload: data,
});