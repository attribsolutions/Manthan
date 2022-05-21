import { call, put, takeEvery } from "redux-saga/effects";
import { Role_Master_Delete_API, Role_Master_Edit_API, Role_Master_Get_API, Role_Master_Post_API, Role_Master_Update_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {getRoleSuccess ,PostSuccess,editSuccess, updateSuccess, getRole} from "./action";
import { POST_ROLE,DELETE_ROLE,EDIT_ROLE,UPDATE_ROLE,GET_Role_API } from "./actionTypes";

// get api
function*  Get_Roles_GenratorFunction() {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(Role_Master_Get_API);
    yield put(getRoleSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield console.log("fetchModulesList  saga page error ***  :", error);
  }
}

//Post Method
function* Post_Roles_GenratorFunction({ Data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Role_Master_Post_API, Data);
    yield put(SpinnerState(false))
    if (response.StatusCode === 200) {
      yield put(PostSuccess({ Status: true }));
      yield put(AlertState({ Type: 1, Status: true, Message: response.Message, RedirectPath: '/RoleListPage', AfterResponseAction: false }));
    } else {
      yield put(AlertState({ Type: 4, Status: true, Message: "error Message", RedirectPath: false, AfterResponseAction: false }));
    }

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 3, Status: true, Message: "Network Error", RedirectPath: false, AfterResponseAction: false }));
    yield console.log("PostSubmit RoleMaster  saga page error", error);
  }
}

  // delete api
    function* Delete_Roles_GenratorFunction({ id }) {
    try {
      yield put(SpinnerState(true))
      const response = yield call(Role_Master_Delete_API, id);
      yield put(SpinnerState(false))
  
      if (response.StatusCode === 200) {
        yield put(AlertState({
          Type: 1, Status: true,
          Message: response.Message,
          RedirectPath: false,
          AfterResponseAction: getRole,
        }))
      }
      else {
        yield put(AlertState({
          Type: 3, Status: true,
          Message: response.Message,
          RedirectPath: false,
          AfterResponseAction: false
        }));
      }
    } catch (error) {
      yield put(SpinnerState(false))
      yield console.log("deleteModule_ID  saga page error ***  :", error);
    }
  }

  // edit api
  function* Edit_Roles_GenratorFunction({ id }) {
    try {   
      const response = yield call(Role_Master_Edit_API, id);
      yield put(editSuccess(response));
  } catch (error) {
   yield console.log("editID Error :", error);
  }
}

 // upadate api
function* Update_Roles_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(Role_Master_Update_API, updateData, ID);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(updateSuccess({ Status: true }));
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: getRole,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield console.log("editModule_ID  saga page error ***  :", error);
  }
}

  function* RoleMaster_Saga() {
    yield takeEvery(GET_Role_API, Get_Roles_GenratorFunction);
    yield takeEvery(POST_ROLE,Post_Roles_GenratorFunction );
    yield takeEvery(EDIT_ROLE, Edit_Roles_GenratorFunction);
    yield takeEvery(DELETE_ROLE, Delete_Roles_GenratorFunction);
    yield takeEvery(UPDATE_ROLE, Update_Roles_GenratorFunction);
  }
  export default RoleMaster_Saga;
  