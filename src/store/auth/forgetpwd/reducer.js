import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  SEND_OTP_FOR_FORGET_PASSWORD_SUCCESS,
  SEND_OTP_FOR_FORGET_PASSWORD_ERROR,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD_ERROR,
  CHANGE_PASSWORD_FOR_FORGET_PASSWORD_SUCCESS,
} from "./actionTypes"

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  sendOtpMegError:null,
  sendOtpError:null,
  sendPasswordMsg:null,
  sendPasswordError:null,
}

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    // case FORGET_PASSWORD:
    //   state = {
    //     ...state,
    //     forgetSuccessMsg: null,
    //     forgetError: null,
   
    //   }
    //   break
    // case FORGET_PASSWORD_SUCCESS:
    //   state = {
    //     ...state,
    //     sendOtpMsg: action.payload,
    //   }
    //   break
    // case FORGET_PASSWORD_ERROR:
    //   state = { ...state,
    //      forgetError: action.payload }
    //   break

    case SEND_OTP_FOR_FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        sendOTPSuccessMsg: action.payload,
      }
      break

    case SEND_OTP_FOR_FORGET_PASSWORD_ERROR:
      state = { ...state,
        sendOtpMegError: action.payload }
      break

      case CHANGE_PASSWORD_FOR_FORGET_PASSWORD_SUCCESS:
        state = {
          ...state,
          sendPasswordMsg: action.payload,
          // sendOTPSuccessMsg: null,
        }
        break
  
      case CHANGE_PASSWORD_FOR_FORGET_PASSWORD_ERROR:
        state = { ...state, 
          sendPasswordError: action.payload ,
          // sendOTPSuccessMsg:'',
          // sendOtpMegError:''
        }
          
  

    default:
      state = { ...state }
      break
  }
  return state
}

export default forgetPassword
