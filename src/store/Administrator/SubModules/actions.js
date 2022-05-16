import {
  POST_SUB_MODULE_ID,
  POST_SUB_MODULE_SUCCESS_ID,
  UPDATE_MODULE,
  UPDATE_MODULE_SUCCESS,
  GET_SUB_MODULES,
  GET_SUB_MODULES_SUCCESS,
  DELETE_SUB_MODULES_USING_ID_SUCCESS,
  DELETE_SUB_MODULES_USING_ID,
  GET_SUB_MODULES_EDIT_DATA_USING_ID,
  GET_SUB_MODULES_EDIT_DATA_USING_ID_SUCCESS,
} from "./actionTypes"


/// post api
export const save_H_Sub_Modules = (Data) => ({
  type: POST_SUB_MODULE_ID,
  Data,
});

export const SaveSubModuleSuccess = (saveMessage) => ({
  type: POST_SUB_MODULE_SUCCESS_ID,
  payload: saveMessage,
});

/// get api
export const getSubModules = () => ({
  type: GET_SUB_MODULES,
});

export const getSubModulesSuccess = (data) => ({
  type: GET_SUB_MODULES_SUCCESS,
  payload: data,
});


////delete api
export const deleteSubModuleUsingID = (id) => ({
  type: DELETE_SUB_MODULES_USING_ID,
  id,

});
export const deleteSubModuleUsingIDSuccess = (data) => ({
  type: DELETE_SUB_MODULES_USING_ID_SUCCESS,
  payload: data
});

///// edit api
export const GetSubModuleEditDataUsingID = (id) => ({
  type: GET_SUB_MODULES_EDIT_DATA_USING_ID,
  id,
})
export const GetSubModuleEditDataUsingIDSuccess = (data) => ({
  type: GET_SUB_MODULES_EDIT_DATA_USING_ID_SUCCESS,
  payload: data,
})

/// update api
export const updateSubModule_UsingID = (updateData, ID) => ({
  type: UPDATE_MODULE,
  updateData, ID,
})
export const updateSubModuleSuccess = (data) => ({
  type: UPDATE_MODULE_SUCCESS,
  payload: data,
})


