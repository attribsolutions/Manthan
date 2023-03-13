import {
  GET_ROLE,
  GET_ROLE_SUCCESS,
  ADD_USER,
  ADD_USER_SUCCESS,
  GET_USER_LIST_FOR_USER,
  GET_USER_LIST_FOR_USER_SUCCESS,
  DELETE_USER,
  DELETE_SUCCESS,
  EDIT_USER,
  EDIT_SUCCESS,
  UPDATE_USER,
  UPDATE_SUCCESS,

  GET_USER_PARTIES_FOR_USER_MASTER,
  GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS,
  GET_EMPLOYEE_FOR_USER_REGISTRATION,
  GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS,
} from './actionType'

/// M_Employee
export const getEmployeeForUseRegistration = () => ({
  type: GET_EMPLOYEE_FOR_USER_REGISTRATION,

});
export const getEmployeeForUseRegistrationSuccess = (resp) => ({
  type: GET_EMPLOYEE_FOR_USER_REGISTRATION_SUCCESS,
  payload: resp,
});

/// Registration Post api
export const addUser = (config) => ({
  type: ADD_USER,
  config,
});

export const addUserSuccess = (resp) => ({
  type: ADD_USER_SUCCESS,
  payload: resp,
});

//get Registration api
export const getUser = () => ({
  type: GET_USER_LIST_FOR_USER,
});

export const getUserSuccess = (resp) => ({
  type: GET_USER_LIST_FOR_USER_SUCCESS,
  payload: resp,
});

////delete api
export const deleteUser = (config={}) => ({
  type: DELETE_USER,
  config,

});
export const deleteSuccess = (resp) => ({
  type: DELETE_SUCCESS,
  payload: resp
});

///// edit api
export const editUserId = (config = {}) => ({
  type: EDIT_USER,
  config,
})
export const editSuccess = (resp) => ({
  type: EDIT_SUCCESS,
  payload: resp,
});

/// update api

export const updateID = (config = {}) => ({
  type: UPDATE_USER,
  config,
});
export const updateSuccess = (resp) => ({
  type: UPDATE_SUCCESS,
  payload: resp,
});
export const GetUserPartiesForUserMastePage = (config) => ({
  type: GET_USER_PARTIES_FOR_USER_MASTER,
  config
});

export const GetUserPartiesForUserMastePageSuccess = (resp) => ({
  type: GET_USER_PARTIES_FOR_USER_MASTER_SUCCESS,
  payload: resp,
});