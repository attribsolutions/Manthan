import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { CHANGE_PASSWORD_FOR_FORGET_PASSWORD, FORGET_PASSWORD, SEND_OTP_FOR_FORGET_PASSWORD } from "./actionTypes"
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions"

//Include Both Helper File with needed methods
import { Python_FoodERP_postJwtForgetPwd } from "../../../helpers/backend_helper"



function* forgetUser({ user }) {
  try {

    const response =  yield call(Python_FoodERP_postJwtForgetPwd,user)
    if (response) {
      yield put(userForgetPasswordSuccess())
    }
  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}


function* sendOTP_GnerFun({ user }) {
  try {
  const response =  yield call(Python_FoodERP_postJwtForgetPwd,user)
  if (response) {
    yield put(userForgetPasswordSuccess())
  }
  } catch (error) {
  yield put(userForgetPasswordError(error))
}
}


function* changePassword_GnerFun({ user }) {
  try {

    const response = "Reset link are sended to your mailbox, check there first"
    // yield call(Python_FoodERP_postJwtForgetPwd,user)
    if (response) {
      yield put(
        userForgetPasswordSuccess("Reset link are sended to your mailbox, check there first"
        )
      )
    }


  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}
export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
  yield takeEvery(SEND_OTP_FOR_FORGET_PASSWORD, sendOTP_GnerFun)
  yield takeEvery(CHANGE_PASSWORD_FOR_FORGET_PASSWORD, changePassword_GnerFun)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
