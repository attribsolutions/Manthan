import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER,} from "./actionTypes"
import { apiError, loginSuccess, logoutUserSuccess } from "./actions"

import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postJwtLogin,
} from "../../../helpers/backend_helper"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postJwtLogin, {
      LoginName: user.UserName,
      password: user.Password
    })
    if (response.StatusCode === 200) {
      
    }
    else {
    
    }
    localStorage.setItem("token", (response.token))
    yield put(loginSuccess(response))
    history.push("/dashboard")
  } catch (error) {
    console.log("login error",error);
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
