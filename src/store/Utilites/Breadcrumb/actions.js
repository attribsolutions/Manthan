import { BREADCRUMB_FILTER_SIZE, COMMON_BREADCRUMB_ALL_DETAIL, BREADCRUMB_SHOW } from "./actionType";

export const Breadcrumb_inputName = (data) => ({
  type: BREADCRUMB_SHOW,
  payload: data,
});

export const BreadcrumbFilterSize = (label) => ({
  type: BREADCRUMB_FILTER_SIZE,
  payload: label,
});

export const CommonBreadcrumbDetails = (props) => ({
  type: COMMON_BREADCRUMB_ALL_DETAIL,
  payload: props,
});



// export const BreadcrumbFilterSizeSuccess = (label) => ({
//   type: BREADCRUMB_FILTER_SIZE_SUCEESS,
//   payload:label,
// });


