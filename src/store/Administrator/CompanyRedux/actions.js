import {
  DELETE_COMPANY_ID,
  DELETE_COMPANY_ID_SUCCESS,
  EDIT_COMPANY_ID,
  EDIT_COMPANY_ID_SUCCESS,
  FETCH_COMPANY_LIST,
  FETCH_COMPANY_LIST_ERROR,
  FETCH_COMPANY_LIST_SUCCESS,
  GET_COMPANYGROUP,
  GET_COMPANYGROUP_SUCCESS,
  POST_COMPANY_SUBMIT,
  POST_COMPANY_SUBMIT_SUCCESS,
  UPDATE_COMPANY_ID,
  UPDATE_COMPANY_ID_SUCCESS
} from "./actionType";

export const saveCompany = (data) => ({
  type: POST_COMPANY_SUBMIT,
  data,
});

export const saveCompany_Success = (data) => ({
  type: POST_COMPANY_SUBMIT_SUCCESS,
  payload: data,
});

// Fetch Modules get Data Actions 
export const getcompanyList = (data) => ({
  type: FETCH_COMPANY_LIST,
  data,
});
export const getCompanyListSuccess = (companyList) => ({
  type: FETCH_COMPANY_LIST_SUCCESS,
  payload: companyList,
});
export const getCompanyListError = (modulesListError) => ({
  type: FETCH_COMPANY_LIST_ERROR,
  payload: modulesListError,
});

//Edit COMPANY Using Id
export const editCompanyID = (id,pageMode) => ({
  type: EDIT_COMPANY_ID,
  id,pageMode
});
export const editCompanyIDSuccess = (editData) => ({
  type: EDIT_COMPANY_ID_SUCCESS,
  payload: editData,
});

// Delete Company ID Actions
export const deleteCompany_ID = (id) => ({
  type: DELETE_COMPANY_ID,
  id,
});
export const deleteCompanyIDSuccess = (deleteCompanyID) => ({
  type:DELETE_COMPANY_ID_SUCCESS,
  payload: deleteCompanyID,
});

export const updateCompanyID = (updateData, ID) => ({
  type: UPDATE_COMPANY_ID,
  updateData, ID
});
export const updateCompanyIDSuccess = (updateMessage) => ({
  type: UPDATE_COMPANY_ID_SUCCESS,
  payload: updateMessage,
});

/// CompanyGroup dropdown
export const getCompanyGroup = () => ({
  type: GET_COMPANYGROUP,
 
});
export const getCompanyGroupSuccess = (CompanyGroup) => ({
  type: GET_COMPANYGROUP_SUCCESS,
  payload:CompanyGroup,
});