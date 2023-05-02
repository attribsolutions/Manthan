import {
  SEND_OTP_FOR_FORGET_PASSWORD_SUCCESS,
  SEND_OTP_FOR_FORGET_PASSWORD_ERROR,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD_ERROR,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD_SUCCESS,
  SEND_OTP_FOR_FORGET_PASSWORD,
} from "./actionTypes"

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  sendOtpMegError: null,
  sendOtpError: null,
  sendPasswordMsg: null,
  sendPasswordError: null,
  Loading:false
}

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case SEND_OTP_FOR_FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        sendOTPSuccessMsg: action.payload,
        Loading: false

      }
      break
    case SEND_OTP_FOR_FORGET_PASSWORD:
      state = {
        ...state,
        Loading: true
      }
      break

    case SEND_OTP_FOR_FORGET_PASSWORD_ERROR:
      state = {
        ...state,
        sendOtpMegError: action.payload
      }
      break

    case CHANGE_PASSWORD_FOR_FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        sendPasswordMsg: action.payload,
      }
      break

    case CHANGE_PASSWORD_FOR_FORGET_PASSWORD_ERROR:
      state = {
        ...state,
        sendPasswordError: action.payload,
      }
      break

    default: state = { ...state }

  }
  return state
}

export default forgetPassword
