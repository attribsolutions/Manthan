import {
  COMMON_PAGE_FILED,
  COMMON_PAGE_FILED_lIST,
  COMMON_PAGE_FILED_lIST_SUCCESS,
  COMMON_PAGE_FILED_SUCCESS,
} from "./actionType";


export const commonPageFieldList = (pageId) => ({
  type: COMMON_PAGE_FILED_lIST,
  pageId,
});
export const commonPageFieldListSuccess = (data) => ({
  type: COMMON_PAGE_FILED_lIST_SUCCESS,
  payload: data,
});


export const commonPageField = (pageId) => ({
  type: COMMON_PAGE_FILED,
  pageId,
});
export const commonPageFieldSuccess = (data) => ({
  type: COMMON_PAGE_FILED_SUCCESS,
  payload: data,
});


