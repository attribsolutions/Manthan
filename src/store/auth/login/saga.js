import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
  LOGIN_USER, LOGOUT_USER,
  ROLE_ACCESS_API_CALL
} from "./actionTypes"
import {
  apiError, loginSuccess,
  logoutUserSuccess,
  RoleAccessUpdateSuccess,
  roleAceessAction,
  roleAceessActionSuccess
} from "./actions"

import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  Python_postJwtLogin, RoleAccessApi_url
} from "../../../helpers/backend_helper"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  debugger
  try {
    const response = yield call(Python_postJwtLogin, {
      LoginName: user.UserName,
      password: user.Password
    })
    if (response.StatusCode === 200) {
      yield put(roleAceessAction(1, 1, 1))

      localStorage.setItem("token", (response.token))
      yield put(loginSuccess(response))

      history.push("/dashboard")
    }
    else {
      alert("Login Error")
    }

  } catch (error) {

    // localStorage.setItem("token", ("response.token"))
    // history.push("/dashboard")
    alert("Login Error")
    console.log("login error", error);

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
function* RoleAccessGenratorFunction({ id1, id2, id3 }) {

  try {
    const RoleResponse = yield call(RoleAccessApi_url, id1, id2, id3);
    if (RoleResponse.Data.length > 0) 
    {
      yield put(roleAceessActionSuccess(RoleResponse.Data))

      let AllDataIntoSinlgeArray =[]

      RoleResponse.Data.map((i)=>{
          i.ModuleData.map((index)=>{
            AllDataIntoSinlgeArray.push(index)
          })
      })
yield put(RoleAccessUpdateSuccess(AllDataIntoSinlgeArray))
    }
  } catch (error) {
    console.log("RoleAccessGenratorFunction", error)
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(ROLE_ACCESS_API_CALL, RoleAccessGenratorFunction)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
