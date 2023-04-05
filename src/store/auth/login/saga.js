import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
  GET_SUPER_ADMIN_API,
  GET_USER_DETAILS_AFTER_LOGIN,
  LOGIN_USER, LOGOUT_USER,
  ROLE_ACCESS_API_CALL
} from "./actionTypes"
import {
  apiError, divisionDropdownSelectSuccess, getUserDetailsActionSuccess,
  postSuperAdminSuccess,
  RoleAccessUpdateSuccess,
  roleAceessActionSuccess
} from "./actions"

import {
  divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall,
  getUserDetails_afterLogin_ApiCall,
  post_SuperAdmin,
  Python_FoodERP_postJwtLogin, RoleAccessApi_url, showPagesListOnPageAccess_DropDown_List,
} from "../../../helpers/backend_helper"
import { AlertState } from "../../actions"


function* loginUser({ payload: { user, history } }) {

  try {
    const response =
      yield call(Python_FoodERP_postJwtLogin, {
        LoginName: user.UserName,
        password: user.Password
      })
    try {
      if (response.StatusCode === 200) {

        localStorage.setItem("token", (response.token))
        localStorage.setItem("userId", (response.UserID))

        history.push("/division")
      }
      else {
        yield put(apiError("Incorrect UserName And Password"))
      }

    } catch (e) {
      yield put(apiError("Incorrect UserName And Password"))
    }

  } catch (error) {
    yield put(apiError("Incorrect UserName And Password"))
  }
}
function* afterLoginUserDetails_genFun({ id }) {

  try {
   
    const response = yield call(getUserDetails_afterLogin_ApiCall, {
      UserId: id,
    })
    yield put(getUserDetailsActionSuccess(response.Data))
    localStorage.setItem("UserName", (response.Data.UserName))
    localStorage.setItem("Company", response.Data.CompanyID)
    localStorage.setItem("CompanyName", response.Data.CompanyName)
    localStorage.setItem("CompanyGroup", response.Data.CompanyGroup)
    if (response.Data.IsSCMCompany) {
      localStorage.setItem("IsSCMCompany", 1)
    }
    else {
      localStorage.setItem("IsSCMCompany", 0)
    }
    var employee = response.Data.EmployeeID;

    const response2 = yield call(divisionDropdown_Forlogin_ChangeDivisionPage_ApiCall, employee,)
    yield put(divisionDropdownSelectSuccess(response2.Data))

  } catch (e) {

  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}
function* RoleAccessGenratorFunction({ party, employee, company }) {

  try {
    const PageAccessApi = yield call(showPagesListOnPageAccess_DropDown_List)

    const RoleResponse = yield call(RoleAccessApi_url, party, employee, company);

    if ((RoleResponse.Data.length > 0) && (PageAccessApi.Data.length > 0)) {

      let arrayMain = []
      let objMain = {}
      let arrayChild = []
      let objChild = {}
      let all_DataInSinlgeArray = []

      RoleResponse.Data.forEach((parent) => {
        objMain = parent;

        parent.ModuleData.forEach((child) => {

          objChild = child;

          PageAccessApi.Data.forEach((page) => {
            objChild[`RoleAccess_${page.Name}`] = false;
          })

          child.RolePageAccess.forEach((role) => {
            child[`RoleAccess_${role.Name}`] = true;
          })

          arrayChild.push(objChild)
          delete objMain.ModuleData
          objMain["ModuleData"] = arrayChild
          objChild = {};

        });
        arrayMain.push(objMain)
        arrayChild = []
        objMain = {}

      })

      arrayMain.forEach((i) => {
        i.ModuleData.forEach((index) => {
          index.ModuleName = i.ModuleName;
          all_DataInSinlgeArray.push(index)
        })
      })


      yield put(roleAceessActionSuccess(arrayMain))
      yield put(RoleAccessUpdateSuccess(all_DataInSinlgeArray))
    }

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error : RoleAccess get Api",
    }));
  }
}

function* Post_SuperAdmin_API_GenratorFunction() {
  try {
    const response = yield call(post_SuperAdmin);
    yield put(postSuperAdminSuccess(response.Data));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}
function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(GET_USER_DETAILS_AFTER_LOGIN, afterLoginUserDetails_genFun)
  yield takeEvery(ROLE_ACCESS_API_CALL, RoleAccessGenratorFunction)
  yield takeEvery(LOGOUT_USER, logoutUser)
  yield takeEvery(GET_SUPER_ADMIN_API, Post_SuperAdmin_API_GenratorFunction)
}

export default authSaga
