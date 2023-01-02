import { BREADCRUMB_FILTER_SIZE, BREADCRUMB_SEARCH_PROPS, BREADCRUMB_SHOW } from "./actionType";

export const Breadcrumb_inputName = (data) => ({
  type: BREADCRUMB_SHOW,
  payload: data,
});

export const BreadcrumbFilterSize = (label) => ({
  type: BREADCRUMB_FILTER_SIZE,
  payload: label,
});

export const BreadcrumbSearchProps = (props) => ({
  type: BREADCRUMB_SEARCH_PROPS,
  payload: props,
});



// export const BreadcrumbFilterSizeSuccess = (label) => ({
//   type: BREADCRUMB_FILTER_SIZE_SUCEESS,
//   payload:label,
// });


