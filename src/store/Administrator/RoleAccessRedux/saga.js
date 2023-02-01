import { call, put, takeEvery } from "redux-saga/effects";
// import {

//   PostModelsSubmitSuccess,
// } from "./actions";
import {
  AddPageHandlerForRoleAccessList_Api,
  GetRoleListForRoleAccessList_Page_Api,
  Get_RoleAccess_List_Page_Api,
  GO_Button_HandlerForRoleAccessList_Api,
  PageDropdownForRoleAccessList_Api, PostMethod_HandlerForRoleAccessList_Api, Post_CopyRoleAccess_for_RoleAccess_Api,

} from "../../../helpers/backend_helper";
import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  GET_ROLEACCESS_LIST_PAGE,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  POST_METHOD_HANDLER_FOR_COPY_ROLE_ACCESS_FOR_ROLE_ACCESS,
  POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
} from "./actionType";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import {
  AddPageHandlerForRoleAccessListPage_Success,
  getRoleAccessListPageSuccess,
  GetRoleListForRoleAccessListPage_Success,
  GO_Button_HandlerForRoleAccessListPage_Success,
  PageDropdownForRoleAccessList_Success,
  PostMethod_ForRoleAccessListPage_Success,
  PostMethod_ForCopyRoleAccessFor_Role_Succes,
  PostMethod_ForCopyRoleAccessFor_Role_Success,
} from "./actions";



function* GetRoleAccessListForRoleAccessList_GenratorFunction({ id1, id2 }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(GetRoleListForRoleAccessList_Page_Api, id1, id2);
    yield put(SpinnerState(false))
    yield put(GetRoleListForRoleAccessListPage_Success(response.Data));
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


function* PageDropdownForRoleAccessList_GenratorFunction({ id1, id2 }) {
  try {
    const response = yield call(PageDropdownForRoleAccessList_Api, id1, id2);
    yield put(PageDropdownForRoleAccessList_Success(response.Data));
  }
  catch (error) {

  }
}

function* GoButtonHandlerForRoleAccessList_GenratorFunction({ id1, id2, id3 }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(GO_Button_HandlerForRoleAccessList_Api, id1, id2,id3);
    yield put(SpinnerState(false))
    yield put(GO_Button_HandlerForRoleAccessListPage_Success(response.Data));
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* AddPageHandlerForRoleAccessList_GenratorFunction({ id }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(AddPageHandlerForRoleAccessList_Api, id);
    yield put(SpinnerState(false))
    yield put(AddPageHandlerForRoleAccessListPage_Success(response.Data));
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* PostMethod_HandlerForRoleAccessList_GenratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {

    const response = yield call(PostMethod_HandlerForRoleAccessList_Api, data);
    yield put(SpinnerState(false))

    yield put(PostMethod_ForRoleAccessListPage_Success(response));
  }
  catch (error) {

    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "RoleAccess Save Method 500 Error",
    }));
  }
}

/// get api

function* Get_RoleAccessList_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Get_RoleAccess_List_Page_Api);
    yield put(getRoleAccessListPageSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "RoleAccess GET Method 500 Error",
    }));
  }
}




function* Post_MethodForCopyRoleAccess_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_CopyRoleAccess_for_RoleAccess_Api, data);
    yield put(PostMethod_ForCopyRoleAccessFor_Role_Success(response));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))

    yield put(AlertState({
      Type: 4,
      Status: true, Message: "RoleAccess Copy Method 500 Error",
    }));
  }
}




function* RoleAccessSaga() {
  yield takeEvery(PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST, PageDropdownForRoleAccessList_GenratorFunction);
  yield takeEvery(GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE, GetRoleAccessListForRoleAccessList_GenratorFunction);
  yield takeEvery(GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, GoButtonHandlerForRoleAccessList_GenratorFunction);
  yield takeEvery(ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, AddPageHandlerForRoleAccessList_GenratorFunction);
  yield takeEvery(POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, PostMethod_HandlerForRoleAccessList_GenratorFunction);
  yield takeEvery(GET_ROLEACCESS_LIST_PAGE, Get_RoleAccessList_GenratorFunction);
  yield takeEvery(POST_METHOD_HANDLER_FOR_COPY_ROLE_ACCESS_FOR_ROLE_ACCESS, Post_MethodForCopyRoleAccess_GenFun);

}

export default RoleAccessSaga;
