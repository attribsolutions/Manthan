import { call, put, takeLatest } from "redux-saga/effects"

// Login Redux States
import {
  GET_SUPER_ADMIN_API,
  GET_USER_DETAILS_AFTER_LOGIN,
  LOGIN_USER, LOGOUT_USER,
  ROLE_ACCESS_API_CALL
} from "./actionTypes"
import {
  apiError, divisionDropdownSelectSuccess, getUserDetailsActionSuccess,
  loginError_Action,
  loginSuccess,
  postSuperAdminSuccess,
  RoleAccessUpdateSuccess,
  roleAceessActionError,
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
    
    const response = yield call(Python_FoodERP_postJwtLogin, {
      LoginName: user.UserName,
      password: user.Password
    })
    
    if (response.StatusCode === 200) {
      yield put(loginSuccess(response))
    } else {
      yield put(loginError_Action(response.Message))

    }
  } catch (error) {
    yield put(loginError_Action("Incorrect Password"))
  }
}
function* afterLoginUserDetails_genFun({ id }) {

  try {
    const response = yield call(getUserDetails_afterLogin_ApiCall, {
      UserId: id,
    })
    if ((response.StatusCode === 200)) {
      yield put(getUserDetailsActionSuccess(response.Data))
    } else {
      throw new Error('Exception message');
    }

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
    if ((response2.StatusCode === 200)) {
      yield put(divisionDropdownSelectSuccess(response2.Data))
    } else {
      throw new Error('Exception message');
    }

  } catch (error) {
    yield put(loginError_Action('Login Erorr...'))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")
    history.push("/login")
  } catch (error) {
    yield put(loginError_Action(error))
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

    yield put(roleAceessActionError(true))
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
  yield takeLatest(LOGIN_USER, loginUser)
  yield takeLatest(GET_USER_DETAILS_AFTER_LOGIN, afterLoginUserDetails_genFun)
  yield takeLatest(ROLE_ACCESS_API_CALL, RoleAccessGenratorFunction)
  yield takeLatest(LOGOUT_USER, logoutUser)
  yield takeLatest(GET_SUPER_ADMIN_API, Post_SuperAdmin_API_GenratorFunction)
}

export default authSaga
