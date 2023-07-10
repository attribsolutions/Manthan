import { takeLatest, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { CHANGE_PASSWORD_FOR_FORGET_PASSWORD, SEND_OTP_FOR_FORGET_PASSWORD, } from "./actionTypes"
import {  userForgetPassword_sendOTP_Success, changePasswordForForgetPasswordSuccess, changePasswordForForgetPasswordError, userForgetPassword_sendOTP_Error } from "./actions"

//Include Both Helper File with needed methods
import { Python_FoodERP_postJwtForgetPwd_SendOTP, Python_FoodERP_postJwtForgetPwd_Verify_OTP } from "../../../helpers/backend_helper"


function* sendOTP_GnerFun({ user }) {
  
  try {
    const response = yield call(Python_FoodERP_postJwtForgetPwd_SendOTP, user)
    if (response.StatusCode === 200) {
      
      yield put(userForgetPassword_sendOTP_Success(response.Message))
    }
    else {
      
      yield put(userForgetPassword_sendOTP_Error(response.Message))
    }
  } catch (error) {
    yield put(userForgetPassword_sendOTP_Error("ForgetPassword Api Error"))
  }
}


function* changePassword_GnerFun({ data }) {
  try {

    const response = yield call(Python_FoodERP_postJwtForgetPwd_Verify_OTP, data)
    //  "Reset link are sended to your mailbox, check there first"

    if (response.StatusCode === 200) {
      yield put(
        changePasswordForForgetPasswordSuccess(response.Message))
    } else {
      yield put(changePasswordForForgetPasswordError(response.Message))
    }

  } catch (error) {
    yield put(changePasswordForForgetPasswordError('Reset password Error'))
  }
}
export function* watchUserPasswordForget() {
  yield takeLatest(SEND_OTP_FOR_FORGET_PASSWORD, sendOTP_GnerFun)
  yield takeLatest(CHANGE_PASSWORD_FOR_FORGET_PASSWORD, changePassword_GnerFun)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
