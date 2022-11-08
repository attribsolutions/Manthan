import {
  COMMON_PAGE_FILED,
  COMMON_PAGE_FILED_lIST,
  COMMON_PAGE_FILED_lIST_SUCCESS,
  COMMON_PAGE_FILED_SUCCESS,
} from "./actionType";


export const commonPageFieldList = (pageId, history) => ({
  type: COMMON_PAGE_FILED_lIST,
  pageId, history,
});
export const commonPageFieldListSuccess = (data) => ({
  type: COMMON_PAGE_FILED_lIST_SUCCESS,
  payload: data,
});

export const commonPageField = (pageId, history) => ({
  type: COMMON_PAGE_FILED,
  pageId, history,
});

export const commonPageFieldSuccess = (data) => ({
  type: COMMON_PAGE_FILED_SUCCESS,
  payload: data,
});


