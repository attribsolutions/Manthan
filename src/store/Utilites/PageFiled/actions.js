import {
  COMMON_PAGE_FILED,
  COMMON_PAGE_FILED_SUCCESS,
} from "./actionType";


export const commonPageField = (pageId) => ({
  type: COMMON_PAGE_FILED,
  payload: pageId,
});
export const commonPageFieldSuccess = (data) => ({
  type: COMMON_PAGE_FILED_SUCCESS,
  payload: data,
});



