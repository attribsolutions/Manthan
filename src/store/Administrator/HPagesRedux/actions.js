import { GET_PAGE_ACCESS } from "../../../helpers/url_helper";
import { DELETE_MODULE_ID_SUCCESS } from "../ModulesRedux/actionType";
import {
  DELETE_HPAGES_USING_ID,
  DELETE_H_MODULE_ID_SUCCESS,
  EDIT_H_PAGES_ID, EDIT_H_PAGES_ID_SUCCESS,
  GET_HPAGES_LIST_DATA,
  GET_HPAGES_LIST_DATA_SUCCESS, GET_H_MODULES,
  GET_H_MODULES_SUCCESS,
  GET_H_SUB_MODULES,
  GET_H_SUB_MODULES_SUCCESS,
  SAVE_HPAGES,
  SAVE_HPAGES_SUCCESS,
  UPDATE_H_PAGES,
  UPDATE_H_PAGES_SUCCESS,
  GET_PAGELIST,
  GET_PAGELIST_SUCCESS,
  GET_PAGEACCESS_DROPDOWN_API_SUCCESS,
  GET_PAGEACCESS_DROPDOWN_API
} from "./actionType";

export const getH_Modules = () => ({
  type: GET_H_MODULES,
});

export const getH_ModulesSuccess = (data) => ({
  type: GET_H_MODULES_SUCCESS,
  payload: data,
});

export const getH_SubModules = (id) => ({
  type: GET_H_SUB_MODULES,
  id,
});


export const getH_SubModulesSuccess = (data) => ({
  type: GET_H_SUB_MODULES_SUCCESS,
  payload: data,
});

// // Fetch Modules get Data Actions 
export const GetHpageListData = (data) => ({
  type: GET_HPAGES_LIST_DATA,
  data,
});
export const GetHpageListDataSuccess = (data) => ({
  type: GET_HPAGES_LIST_DATA_SUCCESS,
  payload: data,
});
export const saveHPages = (Data) => ({
  type: SAVE_HPAGES,
  Data,
});
export const saveHPagesSuccess = (Data) => ({
  type: SAVE_HPAGES_SUCCESS,
  payload: Data,
});
// export const fetchModelsListError = (modulesListError) => ({
//   type: FETCH_MODULES_LIST_ERROR,
//   payload: modulesListError,
// });

// 
export const deleteHpagesUsingID = (id) => ({
  type: DELETE_HPAGES_USING_ID,
  id,
});
export const deleteModuleIDSuccess = (deleteModuleID) => ({
  type: DELETE_H_MODULE_ID_SUCCESS  ,
  payload: deleteModuleID,
});


//Edit Modules Using Id
export const editHPagesID = (id) => ({
  type: EDIT_H_PAGES_ID,
  id,
});
export const editHPagesIDSuccess = (editData) => ({
  type: EDIT_H_PAGES_ID_SUCCESS,
  payload: editData,
});

export const updateHPages = (data, id) => ({
  type: UPDATE_H_PAGES,
  data, id,
});
export const updateHPagesSuccess = (data) => ({
  type: UPDATE_H_PAGES_SUCCESS,
  payload: data,
});

// PageList dropdown api 
export const getPageList = (id) => ({
  type: GET_PAGELIST,
  id,
});
export const getPageListSuccess = (data) => ({
  type: GET_PAGELIST_SUCCESS,
  payload: data,
});

// PageAccess dropdown api 
export const getPageAccess_DropDown_API = (id) => ({
  type: GET_PAGEACCESS_DROPDOWN_API,
  id,
});
export const getPageAccess_DropDown_API_Success = (data) => ({
  type: GET_PAGEACCESS_DROPDOWN_API_SUCCESS,
  payload: data,
});
