import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  SEND_OTP_FOR_FORGET_PASSWORD_SUCCESS,
  SEND_OTP_FOR_FORGET_PASSWORD,
  SEND_OTP_FOR_FORGET_PASSWORD_ERROR,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD_ERROR,
} from "./actionTypes"

export const userForgetPassword = (user, history) => {
  return {
    type: FORGET_PASSWORD,
    payload: { user, history },
  }
}

export const userForgetPasswordSuccess = message => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: message,
  }
}

export const userForgetPasswordError = message => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: message,
  }
}

export const sendOTPForForgetPassword = (data) => {
  return {
    type: SEND_OTP_FOR_FORGET_PASSWORD,
    payload: data,
  }
}

export const sendOTPForForgetPasswordSuccess = (message) => {
  return {
    type: SEND_OTP_FOR_FORGET_PASSWORD_SUCCESS,
    payload: message,
  }
}

export const sendOTPForForgetPasswordError = (message) => {
  return {
    type: SEND_OTP_FOR_FORGET_PASSWORD_ERROR,
    payload: message,
  }
}
export const changePasswordForForgetPassword = (data) => {
  return {
    type: CHANGE_PASSWORD_FOR_FORGET_PASSWORD,
    payload: data,
  }
}

export const changePasswordForForgetPasswordSuccess = (message) => {
  return {
    type: CHANGE_PASSWORD_FOR_FORGET_PASSWORD_SUCCESS,
    payload: message,
  }
}

export const changePasswordForForgetPasswordError = (message) => {
  return {
    type: CHANGE_PASSWORD_FOR_FORGET_PASSWORD_ERROR,
    payload: message,
  }
}
