import {
  BREADCRUMB_SHOW_COUNT_LABLE,
  COMMON_BREADCRUMB_ALL_DETAIL,
  BREADCRUMB_ITEM_NAME,
  BREADCRUMB_DOWN_BTN_DATA,
  BREADCRUMB_REST,
  BREADCRUMB_CHECK_RADIO_BUTTON,
  BREADCRUMB_RADIO_BUTTON_VIEW,
  BREADCRUMB_NON_DELETE_BUTTON,
  BREADCRUMB_DELETE_BUTTON,
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

export const BreadcrumbNonDeleteButton = (config = {}) => {
  return {
    type: BREADCRUMB_NON_DELETE_BUTTON,
    config
  }
}

export const BreadcrumbDeleteButton = (config = {}) => {
  return {
    type: BREADCRUMB_DELETE_BUTTON,
    config
  }
}

export const BreadcrumbRadioButtonView = (IsView) => {
  return {
    type: BREADCRUMB_RADIO_BUTTON_VIEW,
    IsView
  }
}

// export const CommonBreadcrumbDetails_reducer = (props) => ({
//   type: COMMON_BREADCRUMB_ALL_DETAIL_redux,
//   payload: props,
// });





