import {

  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GET_ROLEACCESS_LIST_PAGE,
  GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
} from "./actionType";


export const GetRoleListForRoleAccessListPage = (id1,id2) => ({
  type: GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  id1,id2,
});

export const GetRoleListForRoleAccessListPage_Success = (data) => ({
  type: GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload:data,
});


export const PageDropdownForRoleAccessList = (id) => ({
  type: PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  id,
});

export const PageDropdownForRoleAccessList_Success = (data) => ({
  type: PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST_SUCCESS,
  payload:data,
});

export const GO_Button_HandlerForRoleAccessListPage = (id1,id2) => ({
  type: GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  id1,id2,
});

export const GO_Button_HandlerForRoleAccessListPage_Success = (data) => ({
  type: GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload:data,
});

export const AddPageHandlerForRoleAccessListPage = (id) => ({
  type: ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  id,
});

export const AddPageHandlerForRoleAccessListPage_Success = (data) => ({
  type: ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload:data,
});

export const PostMethodForRoleAccessListPage = (data) => ({
  type: POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  data,
});

export const PostMethod_ForRoleAccessListPage_Success = (data) => ({
  type: POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE_SUCCESS,
  payload:data,
});

// Fetch RoleAccess get Data For List Page 
export const GetRoleAccessListPage = () => ({
  type: GET_ROLEACCESS_LIST_PAGE,
});
export const GetRoleAccessListPageSuccess = (data) => ({
  type: GET_ROLEACCESS_LIST_PAGE_SUCCESS,
  payload: data,
});

