import {

  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  EDIT_ROLEACCESS_ID,
  EDIT_ROLEACCESS_ID_SUCCESS,
  GET_ROLEACCESS_LIST_PAGE,
  GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  SAVE_ROLE_ACCESS_ADD_ACTION,
  SAVE_ROLE_ACCESS_ADD_ACTION_SUCCESS,
  SAVE_COPY_ROLE_ACCESS_ACTION,
  SAVE_COPY_ROLE_ACCESS_ACTION_SUCCESS,
  DELETE_ROLE_ACCESS_lIST_SUCCESS,
  DELETE_ROLE_ACCESS_lIST,
  UPDATE_ROLE_ACCESS_lIST,
  UPDATE_ROLE_ACCESS_lIST_SUCCESS,
  EDIT_ROLE_ACCESS_lIST,
  EDIT_ROLE_ACCESS_lIST_SUCCESS,
} from "./actionType";


export const GetRoleListForRoleAccessListPage = (id1, id2) => ({
  type: GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  id1, id2,
});

export const GetRoleListForRoleAccessListPage_Success = (data) => ({
  type: GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload: data,
});


export const PageDropdownForRoleAccessList = (id1, id2) => ({
  type: PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  id1, id2
});

export const PageDropdownForRoleAccessList_Success = (data) => ({
  type: PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  payload: data,
});

export const GO_Button_HandlerForRoleAccessListPage = (id1, id2, id3) => ({
  type: GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  id1, id2, id3,
});

export const GO_Button_HandlerForRoleAccessListPage_Success = (data) => ({
  type: GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload: data,
});

export const AddPageHandlerForRoleAccessListPage = (id) => ({
  type: ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  id,
});

export const AddPageHandlerForRoleAccessListPage_Success = (data) => ({
  type: ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload: data,
});

export const saveRoleAccessAddAction = (config={}) => ({
  type: SAVE_ROLE_ACCESS_ADD_ACTION,
  config,
});

export const saveRoleAccessAddActionSuccess = (resp) => ({
  type: SAVE_ROLE_ACCESS_ADD_ACTION_SUCCESS,
  payload: resp,
});


// For RoleAccess List Page
export const getRoleAccessListPage = (jsonbody) => ({
  type: GET_ROLEACCESS_LIST_PAGE,
  jsonbody,
});

export const getRoleAccessListPageSuccess = (data) => ({
  type: GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  payload: data,
});

// Copy RoleAccess For RoleAccess
export const saveCopyRoleAccessAction = (data) => ({
  type: SAVE_COPY_ROLE_ACCESS_ACTION,
  data,
});

export const saveCopyRoleAccessActionSuccess = (data) => ({
  type: SAVE_COPY_ROLE_ACCESS_ACTION_SUCCESS,
  payload: data,
});

export const DeleteRoleAcess = (role, division, company) => ({
  type: DELETE_ROLE_ACCESS_lIST,
  role, division, company,
});


export const DeleteRoleAcessSuccess = (data) => ({
  type: DELETE_ROLE_ACCESS_lIST_SUCCESS,
  payload: data,
});

export const EditRoleAcessAction = (config = {}) => ({
  type: EDIT_ROLE_ACCESS_lIST,
  config,
});


export const EditRoleAcessActionSuccess = (resp) => ({
  type: EDIT_ROLE_ACCESS_lIST_SUCCESS,
  payload: resp,
});

export const updateRoleAcessAction = (config = {}) => ({
  type: UPDATE_ROLE_ACCESS_lIST,
  config,
});


export const updateRoleAcessActionSuccess = (resp) => ({
  type: UPDATE_ROLE_ACCESS_lIST_SUCCESS,
  payload: resp,
});


