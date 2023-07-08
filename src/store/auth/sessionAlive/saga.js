import { takeLatest, call } from "redux-saga/effects"
import {  SESSION_ALIVE_NEW_TOKEN } from "./actionTypes"
import { getSessionAlive_Api} from "../../../helpers/backend_helper"


function* getSessionAlive_GenFunc({ jsonBody }) {
  try {
    const response = yield call(getSessionAlive_Api, jsonBody)
    // console.log( "response.access",response)
    if ((response.hasOwnProperty("access"))) {
      localStorage.setItem("token", response.access)
    //  console.log( "response.access",response.access)
    }
  } catch (error) {
  }
}
export function* sessionAlive_saga() {
  yield takeLatest(SESSION_ALIVE_NEW_TOKEN, getSessionAlive_GenFunc)
}

export default sessionAlive_saga
