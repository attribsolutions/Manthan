import {
  DELETE_PAGE_LIST_ID_ACTION,
  DELETE_PAGE_LIST_ID_SUCCESS,
  EDIT_PAGE_LIST_ID_ACTION, EDIT_PAGE_LIST_ID_SUCCESS,
  GET_PAGES_LIST_ACTION,
  GET_PAGES_LIST_ACTION_SUCCESS,
  SAVE_PAGE_MASTER_ACTION,
  SAVE_PAGE_MASTER_SUCCESS,
  UPDATE_PAGE_LIST_ID_ACTION,
  UPDATE_PAGE_LIST_ID_SUCCESS,
  RELATED_PAGELIST_DROPDOWN_ACTION,
  RELATED_PAGELIST_DROPDOWN_SUCCESS,
  GET_PAGEACCESS_DROPDOWN_API_SUCCESS,
  GET_PAGEACCESS_DROPDOWN_API,
  GET_CONTROL_TYPES,
  GET_CONTROL_TYPES_SUCCESS,
  GET_FIELD_VALIDATIONS,
  GET_FIELD_VALIDATIONS_SUCCESS,
  GET_PAGETYPE,
  GET_PAGETYPE_SUCCESS,
  PAGEMASTER_API_ERROR_ACTION,
} from "./actionType";

// Fetch Modules get Data Actions 
export const Get_pageListAction = () => ({
  type: GET_PAGES_LIST_ACTION,
});

export const Get_pageListAction_Success = (resp) => ({
  type: GET_PAGES_LIST_ACTION_SUCCESS,
  payload: resp,
});

export const save_PageMaster_Action = (config = {}) => ({
  type: SAVE_PAGE_MASTER_ACTION,
  config,
});

export const save_PageMaster_Success = (resp) => ({
  type: SAVE_PAGE_MASTER_SUCCESS,
  payload: resp,
});

export const delete_PageListID_Action = (config = {}) => ({
  type: DELETE_PAGE_LIST_ID_ACTION,
  config,
});

export const delete_PageListID_Success = (resp) => ({
  type: DELETE_PAGE_LIST_ID_SUCCESS,
  payload: resp,
});

//Edit Modules Using Id
export const edit_PageListID_Action = (config = {}) => ({
  type: EDIT_PAGE_LIST_ID_ACTION,
  config
});

export const edit_PageListID_Success = (editData) => ({
  type: EDIT_PAGE_LIST_ID_SUCCESS,
  payload: editData,
});

export const update_PageListId_Action = (config = {}) => ({
  type: UPDATE_PAGE_LIST_ID_ACTION,
  config,
});

export const update_PageListId_Success = (resp) => ({
  type: UPDATE_PAGE_LIST_ID_SUCCESS,
  payload: resp,
});

// Related PageList dropdown api 
export const RelatedPageListDropdownAction = (id) => ({
  type: RELATED_PAGELIST_DROPDOWN_ACTION,
  id,
});

export const RelatedPageListDropdownSuccess = (resp) => ({
  type: RELATED_PAGELIST_DROPDOWN_SUCCESS,
  payload: resp,
});

// PageAccess dropdown api 
export const getPageAccess_DropDown_API = (id) => ({
  type: GET_PAGEACCESS_DROPDOWN_API,
  id,
});
export const getPageAccess_DropDown_API_Success = (resp) => ({
  type: GET_PAGEACCESS_DROPDOWN_API_SUCCESS,
  payload: resp,
});

// PageType dropdown api 
export const getPageType = () => ({
  type: GET_PAGETYPE,
});

export const getPageTypeSuccess = (data) => ({
  type: GET_PAGETYPE_SUCCESS,
  payload: data,
});

// ControlTypes
export const getControlTypes = () => ({
  type: GET_CONTROL_TYPES,
});

export const getControlTypesSuccess = (resp) => ({
  type: GET_CONTROL_TYPES_SUCCESS,
  payload: resp,
});

// FieldValidations
export const getFieldValidations = (id) => ({
  type: GET_FIELD_VALIDATIONS,
  id
});

export const getFieldValidationsSuccess = (resp) => ({
  type: GET_FIELD_VALIDATIONS_SUCCESS,
  payload: resp,
});

export const PageMasterApiErrorAction = () => ({
  type: PAGEMASTER_API_ERROR_ACTION,
})