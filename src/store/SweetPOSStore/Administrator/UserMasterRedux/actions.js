import { ADD_POS_USER, ADD_POS_USER_SUCCESS, DELETE_POS_USER_ACTION, DELETE_POS_USER_ACTION_SUCCESS, EDIT_POS_USER_ACTION, EDIT_POS_USER_ACTION_SUCCESS, GET_POS_ROLE, GET_POS_ROLE_SUCCESS, GET_POS_USER_LIST, GET_POS_USER_LIST_SUCCESS, POS_USER_API_ERROR_ACTION, UPDATE_POS_USER_ACTION, UPDATE_POS_USER_ACTION_SUCCESS } from './actionType'

/// M_Employee
export const getPOSRole = () => ({
  type: GET_POS_ROLE,

});
export const getPOSRoleSuccess = (resp) => ({
  type: GET_POS_ROLE_SUCCESS,
  payload: resp,
});

/// Registration save api
export const savePOSUserMasterAction = (config) => ({
  type: ADD_POS_USER,
  config,
});

export const savePOSUserMasterActionSuccess = (resp) => ({
  type: ADD_POS_USER_SUCCESS,
  payload: resp,
});

//get Registration api
export const getPOSUserList = () => ({
  type: GET_POS_USER_LIST,
});

export const getPOSUserListSuccess = (resp) => ({
  type: GET_POS_USER_LIST_SUCCESS,
  payload: resp,
});

////delete api
export const POSuserDeleteAction = (config = {}) => ({
  type: DELETE_POS_USER_ACTION,
  config,

});
export const POSuserDeleteActionSuccess = (resp) => ({
  type: DELETE_POS_USER_ACTION_SUCCESS,
  payload: resp
});


export const POSuserEditAction = (config = {}) => ({
  type: EDIT_POS_USER_ACTION,
  config,
})
export const POSuserEditActionSuccess = (resp) => ({
  type: EDIT_POS_USER_ACTION_SUCCESS,
  payload: resp,
});


export const POSuserUpdateAction = (config = {}) => ({
  type: UPDATE_POS_USER_ACTION,
  config,
});

export const POSuserUpdateActionSuccess = (resp) => ({
  type: UPDATE_POS_USER_ACTION_SUCCESS,
  payload: resp,
});

export const POSUserApiErrorAction = () => ({
  type: POS_USER_API_ERROR_ACTION,
});