import { GET_INWARD_LIST_PAGE, GET_INWARD_LIST_PAGE_SUCCESS, INWARD_LIST_FILTERS, POST_INWARD, POST_INWARD_SUCCESS } from "./actionType";

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
