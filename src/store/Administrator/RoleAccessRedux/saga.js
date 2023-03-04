import { call, put, takeEvery } from "redux-saga/effects";
import {
  AddPageHandlerForRoleAccessList_Api,
  Delete_RoleAccess_Api,
  GetRoleListForRoleAccessList_Page_Api,
  Get_RoleAccess_List_Page_Api,
  GO_Button_HandlerForRoleAccessList_Api,
  PageDropdownForRoleAccessList_Api, PostMethod_HandlerForRoleAccessList_Api, Post_CopyRoleAccess_for_RoleAccess_Api,

} from "../../../helpers/backend_helper";
import {
  ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  DELETE_ROLE_ACCESS_lIST,
  GET_ROLEACCESS_LIST_PAGE,
  GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE,
  GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
  PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST,
  POST_METHOD_HANDLER_FOR_COPY_ROLE_ACCESS_FOR_ROLE_ACCESS,
  POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE,
} from "./actionType";
import {
  AddPageHandlerForRoleAccessListPage_Success,
  getRoleAccessListPageSuccess,
  GetRoleListForRoleAccessListPage_Success,
  GO_Button_HandlerForRoleAccessListPage_Success,
  PageDropdownForRoleAccessList_Success,
  PostMethod_ForRoleAccessListPage_Success,
  PostMethod_ForCopyRoleAccessFor_Role_Success,
  DeleteRoleAcessSuccess,
} from "./actions";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";



function* GetRoleAccessListForRoleAccessList_GenFunc({ id1, id2 }) {
  try {
    const response = yield call(GetRoleListForRoleAccessList_Page_Api, id1, id2);
    yield put(GetRoleListForRoleAccessListPage_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* PageDropdownForRoleAccessList_GenFunc({ id1, id2 }) {
  try {
    const response = yield call(PageDropdownForRoleAccessList_Api, id1, id2);
    yield put(PageDropdownForRoleAccessList_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* GoButtonHandlerForRoleAccessList_GenFunc({ id1, id2, id3 }) {
  try {
    const response = yield call(GO_Button_HandlerForRoleAccessList_Api, id1, id2, id3);
    yield put(GO_Button_HandlerForRoleAccessListPage_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* AddPageHandlerForRoleAccessList_GenFunc({ id }) {
  try {
    const response = yield call(AddPageHandlerForRoleAccessList_Api, id);
    yield put(AddPageHandlerForRoleAccessListPage_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* PostMethod_HandlerForRoleAccessList_GenFunc({ data }) {
  try {
    const response = yield call(PostMethod_HandlerForRoleAccessList_Api, data);
    yield put(PostMethod_ForRoleAccessListPage_Success(response));
  } catch (error) { CommonConsole(error) }
}


function* getList_RoleAccessList_GenFunc({jsonbody}) { // get api 
  try {
    const response = yield call(Get_RoleAccess_List_Page_Api,jsonbody);
    yield put(getRoleAccessListPageSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* Delete_RoleAccessList_GenFunc({ role, division, company }) {// delete Api
  try {
    const response = yield call(Delete_RoleAccess_Api, role, division, company);
    yield put(DeleteRoleAcessSuccess(response));
  } catch (error) { CommonConsole(error) }
}





function* Post_MethodForCopyRoleAccess_GenFun({ data }) {

  try {
    const response = yield call(Post_CopyRoleAccess_for_RoleAccess_Api, data);
    yield put(PostMethod_ForCopyRoleAccessFor_Role_Success(response));

  } catch (error) { CommonConsole(error) }
}




function* RoleAccessSaga() {
  yield takeEvery(DELETE_ROLE_ACCESS_lIST, Delete_RoleAccessList_GenFunc);
  yield takeEvery(PAGE_DROPDOWN_FOR_ROLE_ACCESS_lIST, PageDropdownForRoleAccessList_GenFunc);
  yield takeEvery(GET_ROLE_ACCESS_LIST_FOR_ROLE_ACCESS_lIST_PAGE, GetRoleAccessListForRoleAccessList_GenFunc);
  yield takeEvery(GO_BUTTON_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, GoButtonHandlerForRoleAccessList_GenFunc);
  yield takeEvery(ADD_PAGE_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, AddPageHandlerForRoleAccessList_GenFunc);
  yield takeEvery(POST_METHOD_HANDLER_FOR_ROLE_ACCESS_lIST_PAGE, PostMethod_HandlerForRoleAccessList_GenFunc);
  yield takeEvery(GET_ROLEACCESS_LIST_PAGE, getList_RoleAccessList_GenFunc);
  yield takeEvery(POST_METHOD_HANDLER_FOR_COPY_ROLE_ACCESS_FOR_ROLE_ACCESS, Post_MethodForCopyRoleAccess_GenFun);

}

export default RoleAccessSaga;
