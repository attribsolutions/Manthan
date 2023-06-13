import {
  SAVE_COMPANY_GROUP_MASTER,
  SAVE_COMPANY_GROUP_MASTER_SUCCESS,
  GET_COMPANY_GROUP_LIST,
  GET_COMPANY_GROUP_LIST_SUCCESS,
  DELETE_COMPANY_GROUP_ID,
  DELETE_COMPANY_GROUP_ID_SUCCESS,
  EDIT_COMPANY_GROUP_ID,
  EDIT_COMPANY_GROUP_ID_SUCCESS,
  UPDATE_COMPANY_GROUP_ID,
  UPDATE_COMPANY_GROUP_ID_SUCCESS,
  COMPANY_GROUP_API_ERROR_ACTION
} from "./actionType";

export const getCompanyGroupList = () => ({// get List Action
  type: GET_COMPANY_GROUP_LIST,
});

export const getCompanyGroupListSuccess = (resp) => ({// get List success
  type: GET_COMPANY_GROUP_LIST_SUCCESS,
  payload: resp,
});

export const saveCompanyGroupMaster = (config = {}) => ({// save Action
  type: SAVE_COMPANY_GROUP_MASTER,
  config,
});

export const saveCompanyGroupMasterSuccess = (resp) => ({// Save  success
  type: SAVE_COMPANY_GROUP_MASTER_SUCCESS,
  payload: resp,
});

export const editCompanyGroupID = (config = {}) => ({// edit  Action
  type: EDIT_COMPANY_GROUP_ID,
  config,
})
export const editCompanyGroupSuccess = (resp) => ({//edit Success
  type: EDIT_COMPANY_GROUP_ID_SUCCESS,
  payload: resp,
})

export const updateCompanyGroupID = (config = {}) => ({// update  Action
  type: UPDATE_COMPANY_GROUP_ID,
  config,
})

export const updateCompanyGroupIDSuccess = (resp) => ({// update Success
  type: UPDATE_COMPANY_GROUP_ID_SUCCESS,
  payload: resp,
})

export const deleteCompanyGroupID = (config = {}) => ({// Delete Action 
  type: DELETE_COMPANY_GROUP_ID,
  config,
});

export const deleteCompanyGroupIDSuccess = (resp) => ({// Delete  Success
  type: DELETE_COMPANY_GROUP_ID_SUCCESS,
  payload: resp
});

export const companyGroupApiErrorAction = () => ({
  type: COMPANY_GROUP_API_ERROR_ACTION,
})