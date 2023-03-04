import {
  BREADCRUMB_SHOW_COUNT_LABLE,
  COMMON_BREADCRUMB_ALL_DETAIL,
  BREADCRUMB_ITEM_NAME,
  BREADCRUMB_DOWN_BTN_DATA,
  BREADCRUMB_REST,
} from "./actionType";


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

export const BreadcrumbDownBtndata = (data) => ({
  type: BREADCRUMB_DOWN_BTN_DATA,
  payload: data,
});

export const BreadcrumbReset = (label) => {
  return {
    type: BREADCRUMB_REST,
    payload: label,
  }
}


// export const CommonBreadcrumbDetails_reducer = (props) => ({
//   type: COMMON_BREADCRUMB_ALL_DETAIL_redux,
//   payload: props,
// });





