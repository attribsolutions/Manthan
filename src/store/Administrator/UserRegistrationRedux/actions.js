import {
  ADD_USER,
  ADD_USER_SUCCESS,
  GET_USER_LIST_FOR_USER,
  GET_USER_LIST_FOR_USER_SUCCESS,
  DELETE_USER_ACTION,
  DELETE_USER_ACTION_SUCCESS,
  EDIT_USER_ACTION,
  EDIT_USER_ACTION_SUCCESS,
  UPDATE_USER_ACTION,
  UPDATE_USER_ACTION_SUCCESS,

  GET_USER_PARTIES_FOR_USER_MASTER,
  GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS,
  GET_EMPLOYEE_FOR_USER_REGISTRATION,
  GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS,
  USER_API_ERROR_ACTION,
} from './actionType'

/// M_Employee
export const getEmployeeForUseRegistration = () => ({
  type: GET_EMPLOYEE_FOR_USER_REGISTRATION,

});
export const getEmployeeForUseRegistrationSuccess = (resp) => ({
  type: GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS,
  payload: resp,
});

/// Registration save api
export const saveUserMasterAction = (config) => ({
  type: ADD_USER,
  config,
});

export const saveUserMasterActionSuccess = (resp) => ({
  type: ADD_USER_SUCCESS,
  payload: resp,
});

//get Registration api
export const getUserList = () => ({
  type: GET_USER_LIST_FOR_USER,
});

export const getUserListSuccess = (resp) => ({
  type: GET_USER_LIST_FOR_USER_SUCCESS,
  payload: resp,
});

////delete api
export const userDeleteAction = (config = {}) => ({
  type: DELETE_USER_ACTION,
  config,

});
export const userDeleteActionSuccess = (resp) => ({
  type: DELETE_USER_ACTION_SUCCESS,
  payload: resp
});


export const userEditAction = (config = {}) => ({
  type: EDIT_USER_ACTION,
  config,
})
export const userEditActionSuccess = (resp) => ({
  type: EDIT_USER_ACTION_SUCCESS,
  payload: resp,
});


export const userUpdateAction = (config = {}) => ({
  type: UPDATE_USER_ACTION,
  config,
});

export const userUpdateActionSuccess = (resp) => ({
  type: UPDATE_USER_ACTION_SUCCESS,
  payload: resp,
});

export const GetUserPartiesForUserMastePage = (editDetail) => ({
  type: GET_USER_PARTIES_FOR_USER_MASTER,
  editDetail
});

export const GetUserPartiesForUserMastePageSuccess = (resp) => ({
  type: GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS,
  payload: resp,
});

export const UserApiErrorAction = () => ({
  type: USER_API_ERROR_ACTION,
});