import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  ROLE_ACCESS_API_CALL,
  ROLE_ACCESS_API_CALL_SUCCESS,
  ROLE_ACCESS_API_UPDATE_SUCCESS,
  GET_USER_DETAILS_AFTER_LOGIN,
  GET_USER_DETAILS_AFTER_LOGIN_SUCCESS,
  DESISION_DEROPDOWN_SUCCESS_AFTER_LOGIN
} from "./actionTypes"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}

export  const getUserDetailsAction=(id)=>{
  return{
    type:GET_USER_DETAILS_AFTER_LOGIN,
    id,
  }
}

export  const divisionDropdownSelectSuccess=(data)=>{
  return{
    type:DESISION_DEROPDOWN_SUCCESS_AFTER_LOGIN,
    payload: data,
  }
}

  export  const getUserDetailsActionSuccess=(data)=>{
    return{
      type:GET_USER_DETAILS_AFTER_LOGIN_SUCCESS,
      payload: data,
    }
    }

export  const roleAceessAction=(id1,id2,id3)=>{
return{
  type:ROLE_ACCESS_API_CALL,
  id1,id2,id3,
}
}
export  const roleAceessActionSuccess=(data)=>{
  return{
    type:ROLE_ACCESS_API_CALL_SUCCESS,
    payload: data,
  }
  }

  export  const RoleAccessUpdateSuccess=(data)=>{
    return{
      type:ROLE_ACCESS_API_UPDATE_SUCCESS,
      payload: data,
    }
    }