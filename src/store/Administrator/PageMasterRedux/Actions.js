import {
  POST_DEFAULT_MODULE_ID,
  POST_DEFAULT_MODULE_ID_SUCCESS,
  POST_SUB_MODULE,
  POST_SUB_MODULE_SUCCESS,
  GET_PAGE_ACCESS,
  GET_PAGE_ACCESS_SUCCESS,
  ADD_PAGE,
  ADD_PAGE_SUCCESS,
  GET_DEFAULT_MODULE,
  GET_DEFAULT_MODULE_SUCCESS,

  // GET_INVOICE_DETAIL_FAIL
} from "./actionType";
export const getDefaultModule = (id) =>
  ({
  type: GET_DEFAULT_MODULE,
  id,
});
export const getDefaultModuleSuccess = (DefaultModuleData) => ({
  type: GET_DEFAULT_MODULE_SUCCESS,
 payload:DefaultModuleData,
});
export const postDefaultModuleId = (id) => ({
  type: POST_DEFAULT_MODULE_ID,
  id,
});

export const postDefaultModuleSuccess = (ModuleData) => ({
  type: POST_DEFAULT_MODULE_ID_SUCCESS,
  payload: ModuleData,
});

export const postSubModule = (id) => ({
  type: POST_SUB_MODULE,
  id,
});

export const postSubModuleSuccess = (SubModuleData) => ({
  type: POST_SUB_MODULE_SUCCESS,
  payload: SubModuleData,
});
export const getPageAcess = () => ({
  type: GET_PAGE_ACCESS,
  
});

export const getPageAcessSuccess = (PageAccessData) => ({
  type: GET_PAGE_ACCESS_SUCCESS,
  payload: PageAccessData,
});

export const addPage = (Data) => ({
  type: ADD_PAGE,
  Data,
});

export const addPageSuccess = (AddPageMessage) => ({
  type: ADD_PAGE_SUCCESS,
  payload: AddPageMessage,
});
