import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  SOCIAL_LOGIN,
  ROLE_ACCESS_API_CALL,
  ROLE_ACCESS_API_CALL_SUCCESS,
  ROLE_ACCESS_API_UPDATE_SUCCESS,
  GET_USER_DETAILS_AFTER_LOGIN,
  GET_USER_DETAILS_AFTER_LOGIN_SUCCESS,
  GET_SUPER_ADMIN_API,
  GET_SUPER_ADMIN_API_SUCCESS,
  LOGOUT_REST,
  RESET_ROLE_ACCESS_ACTION,
  ROLE_ACCESS_API_CALL_ERROR,
  API_ERROR_SUCCESS,
  LOGIN_ERROR_ACTION,
  DIVISION_DROPDOWN_AFTER_LOGIN_ACTION,
  DIVISION_DROPDOWN_AFTER_LOGIN_ACTION_SCUCESS
} from "./actionTypes"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccessAction = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}
export const loginError_Action = state => {
  return {
    type: LOGIN_ERROR_ACTION,
    payload: state,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
    user: null
  }
}
export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}
// export const apiError = (error) => {
//   return {
//     type: API_ERROR,
//     payload: error,
//   }
// }

export const apiErrorSuccess = () => {
  return {
    type: API_ERROR_SUCCESS,
    payload: null,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}

export const getUserDetailsAction = (id) => {
  return {
    type: GET_USER_DETAILS_AFTER_LOGIN,
    id,
  }
}
export const divisionDropdownSelectAction = (employeeID) => {
  return {
    type: DIVISION_DROPDOWN_AFTER_LOGIN_ACTION,
    employeeID,
  }
}


export const divisionDropdownSelectSuccess = (data) => {
  return {
    type: DIVISION_DROPDOWN_AFTER_LOGIN_ACTION_SCUCESS,
    payload: data,
  }
}


export const getUserDetailsActionSuccess = (data) => {
  return {
    type: GET_USER_DETAILS_AFTER_LOGIN_SUCCESS,
    payload: data,
  }
}

export const roleAceessAction = (party, employee, company) => {
  return {
    type: ROLE_ACCESS_API_CALL,
    party, employee, company,
  }
}
export const roleAceessActionSuccess = (data) => {
  return {
    type: ROLE_ACCESS_API_CALL_SUCCESS,
    payload: data,
  }
}
export const roleAceessActionError = (error) => {
  return {
    type: ROLE_ACCESS_API_CALL_ERROR,
    payload: error,
  }
}


export const RoleAccessUpdateSuccess = (data) => {
  return {
    type: ROLE_ACCESS_API_UPDATE_SUCCESS,
    payload: data,
  }
}

export const postSuperAdmin = () => ({
  type: GET_SUPER_ADMIN_API,
});

export const postSuperAdminSuccess = (data) => ({
  type: GET_SUPER_ADMIN_API_SUCCESS,
  payload: data,
});


export const logoutReset = (data) => {
  return {
    type: LOGOUT_REST,
    payload: data,
  }
}
export const resetRoleAccessAction = (data) => {
  return {
    type: RESET_ROLE_ACCESS_ACTION,
    payload: data,
  }
}