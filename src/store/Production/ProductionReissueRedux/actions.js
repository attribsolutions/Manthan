import {
  DELETE_PRODUCTION_RE_ISSUE_ID,
  DELETE_PRODUCTION_RE_ISSUE_SUCCESS,
  EDIT_PRODUCTION_RE_ISSUE,
  EDIT_PRODUCTION_RE_ISSUE_SUCCESS,
  GET_PRODUCTION_RE_ISSUE_LIST_PAGE,
  GET_PRODUCTION_RE_ISSUE_LIST_PAGE_SUCCESS,
  MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION,
  MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION_SUCCESS,
  ITEM_FOR_PRODUNCTION_RE_ISSUE,
  ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS,
  SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE,
  SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE_SUCCESS,
  UPDATE_PRODUCTION_RE_ISSUE,
  UPDATE_PRODUCTION_RE_ISSUE_SUCCESS
} from './actionType'

export const Save_Production_ReIssue = (data) => ({
  type: SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE,
  data
});
export const Save_Production_ReIssueSuccess = (msg) => ({
  type: SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE_SUCCESS,
  payload: msg
});

export const getProduction_ReIssueListPage = (filters) => ({
  type: GET_PRODUCTION_RE_ISSUE_LIST_PAGE,
  filters,
});

export const getProduction_ReIssueistPageSuccess = (data) => ({
  type: GET_PRODUCTION_RE_ISSUE_LIST_PAGE_SUCCESS,
  payload: data,
});


export const edit_Production_ReIssueId = (id, pageMode) => ({
  type: EDIT_PRODUCTION_RE_ISSUE,
  id, pageMode,
});

export const edit_Production_ReIssueIdSuccess = (data) => ({
  type: EDIT_PRODUCTION_RE_ISSUE_SUCCESS,
  payload: data,
});

export const update_Production_ReIssueId = (data, id) => ({
  type: UPDATE_PRODUCTION_RE_ISSUE,
  data, id,
});
export const update_Production_ReIssueIdSuccess = (data) => ({
  type: UPDATE_PRODUCTION_RE_ISSUE_SUCCESS,
  payload: data,
});


export const delete_Production_ReIssueId = (id) => ({
  type: DELETE_PRODUCTION_RE_ISSUE_ID,
  id,
});
export const delete_Production_ReIssueIdSuccess = (data) => ({
  type: DELETE_PRODUCTION_RE_ISSUE_SUCCESS,
  payload: data,
});


export const ItemForProdunction_ReIssue = (data) => ({
  type: ITEM_FOR_PRODUNCTION_RE_ISSUE,
  data,
});
export const ItemForProdunction_ReIssueSuccess = (items) => ({
  type: ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS,
  payload: items,
});

export const makeBtnProduction_ReIssue_STP_action = (data) => ({
  type: MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION,
  data,
});
export const makeBtnProduction_ReIssue_STP_actionSuccess = (items) => ({
  type: MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION_SUCCESS,
  payload: items,
});