import { DELETE_HPAGES_USING_ID, EDIT_H_PAGES_ID, EDIT_H_PAGES_ID_SUCCESS, EDIT_SUBMODULE_ID, EDIT_SUBMODULE_ID_SUCCESS, GET_HPAGES_LIST_DATA, GET_HPAGES_LIST_DATA_SUCCESS, GET_H_MODULES,
   GET_H_MODULES_SUCCESS,
   GET_H_SUB_MODULES,
   GET_H_SUB_MODULES_SUCCESS, 
   SAVE_HPAGES, 
   SAVE_HPAGES_SUCCESS, 
   UPDATE_H_PAGES, 
   UPDATE_H_PAGES_SUCCESS, 
} from "./actionType";

export const getH_Modules = () => ({
  type: GET_H_MODULES,
});

export const getH_ModulesSuccess = (modulesData) => ({
  type: GET_H_MODULES_SUCCESS,
  payload:modulesData,
});
export const getH_SubModules = (id) => ({
  type: GET_H_SUB_MODULES,
  id,
});


export const getH_SubModulesSuccess = (SubModulesData) => ({
  type: GET_H_SUB_MODULES_SUCCESS,
  payload:SubModulesData,
});

// // Fetch Modules get Data Actions 
export const GetHpageListData = (data) => ({
  type: GET_HPAGES_LIST_DATA,
  data,
});
export const GetHpageListDataSuccess = (HPagesListData) => ({
  type: GET_HPAGES_LIST_DATA_SUCCESS,
  payload: HPagesListData,
});
export const saveHPages = (data) => ({
  type: SAVE_HPAGES,
  data,
});
export const saveHPagesSuccess = (saveMessage) => ({
  type: SAVE_HPAGES_SUCCESS,
  payload: saveMessage,
});
// export const fetchModelsListError = (modulesListError) => ({
//   type: FETCH_MODULES_LIST_ERROR,
//   payload: modulesListError,
// });

// 
export const deleteHpagesUsingID = (id) => ({
  type: DELETE_HPAGES_USING_ID,
  payload: id,
});
// export const deleteModuleIDError = (deleteModuleIDError) => ({
//   type: DELETE_MODULE_ID_ERROR,
//   payload: deleteModuleIDError,
// });


//Edit Modules Using Id
export const editHPagesID = (id) => ({
  type: EDIT_H_PAGES_ID,
  id,
});
export const editHPagesIDSuccess = (editData) => ({
  type: EDIT_H_PAGES_ID_SUCCESS,
  payload: editData,
});

export const updateHPages = (data,id) => ({
  type: UPDATE_H_PAGES,
  data,id,
});
export const updateHPagesSuccess = (updateMessage) => ({
  type: UPDATE_H_PAGES_SUCCESS,
  payload: updateMessage,
});