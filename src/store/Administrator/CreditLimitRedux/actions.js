import {
  GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
  GO_BUTTON_FOR_CREDITLIMIT_PAGE,
  POST_CREDITLIMIT_PAGE_SUCCESS,
  POST_CREDITLIMIT_PAGE,
} from './actionTypes'

export const GoButton_For_CreditLimit_Add = (jsonBody) => ({
  type: GO_BUTTON_FOR_CREDITLIMIT_PAGE,
  jsonBody,
});

export const GoButton_For_CreditLimit_AddSuccess = (data) => ({
  type: GO_BUTTON_FOR_CREDITLIMIT_PAGE_SUCCESS,
  payload: data,
});

export const postCreditLimit = (config={}) => ({
  type: POST_CREDITLIMIT_PAGE,
  config,
});

export const postCreditLimitSuccess = (resp) => ({
  type: POST_CREDITLIMIT_PAGE_SUCCESS,
  payload: resp
});

