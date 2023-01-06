import { BREADCRUMB_SHOW_COUNT_LABLE, COMMON_BREADCRUMB_ALL_DETAIL, BREADCRUMB_ITEM_NAME, COMMON_BREADCRUMB_ALL_DETAIL_redux } from "./actionType";

export const Breadcrumb_inputName = (data) => ({
  type: BREADCRUMB_ITEM_NAME,
  payload: data,
});

export const BreadcrumbShowCountlabel = (label) => ({
  type: BREADCRUMB_SHOW_COUNT_LABLE,
  payload: label,
});

export const CommonBreadcrumbDetails = (props) => ({
  type: COMMON_BREADCRUMB_ALL_DETAIL,
  payload: props,
});
export const CommonBreadcrumbDetails_reducer = (props) => ({
  type: COMMON_BREADCRUMB_ALL_DETAIL_redux,
  payload: props,
});




// export const BreadcrumbShowCountlabelSuccess = (label) => ({
//   type: BREADCRUMB_ITEM_NAME_LABLE_SUCEESS,
//   payload:label,
// });


