import {
  COMPANY_API_ERROR_ACTION,
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

export const getcompanyList = () => ({ // get List Action
  type: FETCH_COMPANY_LIST,
});

export const getCompanyListSuccess = (companyList) => ({  // get List success
  type: FETCH_COMPANY_LIST_SUCCESS,
  payload: companyList,
});

export const saveCompany = (config={}) => ({  // save Action
  type: POST_COMPANY_SUBMIT,
  config,
});

export const saveCompany_Success = (resp) => ({ // Save  success
  type: POST_COMPANY_SUBMIT_SUCCESS,
  payload: resp,
});

export const getCompanyListError = (modulesListError) => ({  //get company list error
  type: FETCH_COMPANY_LIST_ERROR,
  payload: modulesListError,
});

export const editCompanyID = (config = {}) => ({  // Edit Action 
  type: EDIT_COMPANY_ID,
  config ,
});
export const editCompanyIDSuccess = (editData) => ({  // Edit  Success
  type: EDIT_COMPANY_ID_SUCCESS,
  payload: editData,
});

export const updateCompanyID = (config = {}) => ({   // update  Action
  type: UPDATE_COMPANY_ID,
  config, 
});
export const updateCompanyIDSuccess = (resp) => ({    //Update Success
  type: UPDATE_COMPANY_ID_SUCCESS,
  payload: resp,
});

export const getCompanyGroup = () => ({     //get company gropu
  type: GET_COMPANYGROUP,
 
});
export const getCompanyGroupSuccess = (CompanyGroup) => ({  //get company group Success
  type: GET_COMPANYGROUP_SUCCESS,
  payload:CompanyGroup,
});

export const deleteCompany_ID = (config={}) => ({  // Delete  Action
  type: DELETE_COMPANY_ID,
  config,
});
export const deleteCompanyIDSuccess = (resp) => ({  // Delete Success
  type:DELETE_COMPANY_ID_SUCCESS,
  payload: resp,
});

export const companyApiErrorAction = () => ({
  type: COMPANY_API_ERROR_ACTION,
})