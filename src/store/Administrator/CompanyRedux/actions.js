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



export const PostCompanySubmit = (data) => ({
  type: POST_COMPANY_SUBMIT,
  data,
});


export const PostCompanySubmitSuccess = (companySubmitSuccesss) => ({
  type: POST_COMPANY_SUBMIT_SUCCESS,
  payload: companySubmitSuccesss,
});
// export const PostModelsSubmitError = (modulesSubmitError) => ({
//   type: POST_MODULES_SUBMIT_ERROR,
//   payload: modulesSubmitError,
// });

// Fetch Modules get Data Actions 
export const fetchCompanyList = (data) => ({
  type: FETCH_COMPANY_LIST,
  data,
});
export const fetchCompanyListSuccess = (companyList) => ({
  type: FETCH_COMPANY_LIST_SUCCESS,
  payload: companyList,
});
export const fetchCompanyListError = (modulesListError) => ({
  type: FETCH_COMPANY_LIST_ERROR,
  payload: modulesListError,
});

//Edit COMPANY Using Id
export const editCompanyID = (id) => ({
  type: EDIT_COMPANY_ID,
  id,
});
export const editCompanyIDSuccess = (editData) => ({
  type: EDIT_COMPANY_ID_SUCCESS,
  payload: editData,
});

// Delete Company ID Actions
export const deleteCompanyID = (id) => ({
  type: DELETE_COMPANY_ID,
  id,
});
export const deleteCompanyIDSuccess = (deleteCompanyID) => ({
  type:DELETE_COMPANY_ID_SUCCESS,
  payload: deleteCompanyID,
});

export const updateCompanyID = (data,id) => ({
  type: UPDATE_COMPANY_ID,
  data,id,
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