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
  GET_PAGEACCESS_DROPDOWN_API,
  GET_CONTROL_TYPES,
  GET_CONTROL_TYPES_SUCCESS,
  GET_FIELD_VALIDATIONS,
  GET_FIELD_VALIDATIONS_SUCCESS,
  GET_PAGETYPE,
  GET_PAGETYPE_SUCCESS,
  PAGEMASTER_API_ERROR_ACTION,
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
// export const getModuleListError = (modulesListError) => ({
//   type: FETCH_MODULES_LIST_ERROR,
//   payload: modulesListError,
// });

// 
export const deleteHpagesUsingID = (id) => ({
  type: DELETE_HPAGES_USING_ID,
  id,
});
export const deleteModuleIDSuccess = (deleteModuleID) => ({
  type: DELETE_H_MODULE_ID_SUCCESS,
  payload: deleteModuleID,
});


//Edit Modules Using Id
export const editHPagesID = (id, pageMode) => ({
  type: EDIT_H_PAGES_ID,
  id, pageMode
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

// PageType dropdown api 
export const getPageType = (id) => ({
  type: GET_PAGETYPE,
  id,
});
export const getPageTypeSuccess = (data) => ({
  type: GET_PAGETYPE_SUCCESS,
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

// ControlTypes
export const getControlTypes = () => ({
  type: GET_CONTROL_TYPES,
});

export const getControlTypesSuccess = (data) => ({
  type: GET_CONTROL_TYPES_SUCCESS,
  payload: data,
});
// FieldValidations
export const getFieldValidations = (id) => ({
  type: GET_FIELD_VALIDATIONS,
  id
});

export const getFieldValidationsSuccess = (data) => ({
  type: GET_FIELD_VALIDATIONS_SUCCESS,
  payload: data,
});

export const PageMasterApiErrorAction = () => ({
  type: PAGEMASTER_API_ERROR_ACTION,
})