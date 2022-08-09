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
  Python_FoodERP_postJwtLogin, RoleAccessApi_url, showPagesListOnPageAccess_DropDown_List
} from "../../../helpers/backend_helper"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  debugger
  try {
    const response =
     yield call(Python_FoodERP_postJwtLogin, {
      LoginName: user.UserName,
      password: user.Password
    })
    try{
      if (response.StatusCode === 200) {
      yield put(roleAceessAction(1, 1, 1))

      localStorage.setItem("token", (response.token))
      yield put(loginSuccess(response))

      history.push("/dashboard")
    }
    
  }catch(e){
    yield apiError("response.non_field_errors")
  }

  } catch (error) {
    yield put(apiError("Incorrect UserName And Password"))
    // localStorage.setItem("token", ("response.token"))
    // history.push("/dashboard")
    // alert("Login Error")

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
    const PageAccessApi = yield call(showPagesListOnPageAccess_DropDown_List)
 
    const RoleResponse = yield call(RoleAccessApi_url, id1, id2, id3);

    if ((RoleResponse.Data.length > 0)&&(PageAccessApi.Data.length>0)) {

      let ArrayMain = []
      let ElementMain = {}
      let ArrayChieldSecond = []
      let ElementChieldSecond = {}
      let all_DataInSinlgeArray = []

      RoleResponse.Data.map((index_main) => {
        ElementMain = index_main;

        index_main.ModuleData.map((index_secd) => {

          ElementChieldSecond = index_secd;

          PageAccessApi.Data.map((index_PageAccess) => {
            ElementChieldSecond[`RoleAccess_${index_PageAccess.Name}`] = false;
          })
          // ElementChieldSecond[`PageAccess_IsSave`] = false;
          // ElementChieldSecond[`PageAccess_IsEdit`] = false;
          // ElementChieldSecond[`PageAccess_IsDelete`] = false;
          // ElementChieldSecond[`PageAccess_IsEditSelf`] = false;
          // ElementChieldSecond[`PageAccess_IsDeleteSelf`] = false;
          // ElementChieldSecond[`PageAccess_IsShow`] = false;
          // ElementChieldSecond[`PageAccess_IsView`] = false;
          // ElementChieldSecond[`PageAccess_IsTopOfTheDivision`] = false;

          index_secd.RolePageAccess.map((rolIndex) => {
            ElementChieldSecond[`RoleAccess_${rolIndex.Name}`] = true;
          })

          ArrayChieldSecond.push(ElementChieldSecond)
          delete ElementMain.ModuleData
          ElementMain["ModuleData"] = ArrayChieldSecond
          ElementChieldSecond = {};

        })
        ArrayMain.push(ElementMain)
        ArrayChieldSecond = []
        ElementMain = {

        }
      })

      ArrayMain.map((i) => {
        i.ModuleData.map((index) => {
          all_DataInSinlgeArray.push(index)
        })
      })
      // console.log('ArrayMain',ArrayMain)
      // console.log('RoleResponse.Data',RoleResponse.Data)

      yield put(roleAceessActionSuccess(ArrayMain))
      yield put(RoleAccessUpdateSuccess(all_DataInSinlgeArray))
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
