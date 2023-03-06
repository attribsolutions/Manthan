import { call, put, takeEvery } from "redux-saga/effects";
import {
  PostMethod_ForCompanyGroupMasterSuccess,
  getMethod_ForCompanyGroupListSuccess,
  deleteCompanyGroupTypeIDSuccess,
  editCompanyGroupTypeSuccess,
  updateCompanyGroupTypeIDSuccess
} from "./action";
import {
  get_CompanyGroupList_API,
  Post_CompanyGroup_API,
  detelet_CompanyGroupType_List_Api,
  edit_CompanyGroupType_List_Api,
  update_CompanyGroupType_List_Api,
} from "../../../helpers/backend_helper";
import {
  POST_METHOD_FOR_COMPANYGROUP_MASTER,
  GET_METHOD_FOR_COMPANYGROUP_LIST,
  DELETE_COMPANYGROUP_TYPE_ID,
  EDIT_COMPANYGROUP_TYPE_ID,
  UPDATE_COMPANYGROUP_TYPE_ID
} from "./actionType";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

// Get List Page API
function* Get_CompanyGroup_GenratorFunction() {
  try {
    const response = yield call(get_CompanyGroupList_API);
    yield put(getMethod_ForCompanyGroupListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// post api
function* Post_Method_For_CompanyGroup_GenFun({ data }) {
  try {
    const response = yield call(Post_CompanyGroup_API, data);
    yield put(PostMethod_ForCompanyGroupMasterSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_CompanyGroupType_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(detelet_CompanyGroupType_List_Api, id);
    yield put(deleteCompanyGroupTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_CompanyGroupType_ID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_CompanyGroupType_List_Api, id);
    response.pageMode = pageMode
    yield put(editCompanyGroupTypeSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_CompanyGroupType_ID_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_CompanyGroupType_List_Api, updateData, ID);
    yield put(updateCompanyGroupTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* CompanyGroupSaga() {
  yield takeEvery(POST_METHOD_FOR_COMPANYGROUP_MASTER, Post_Method_For_CompanyGroup_GenFun)
  yield takeEvery(GET_METHOD_FOR_COMPANYGROUP_LIST, Get_CompanyGroup_GenratorFunction)
  yield takeEvery(DELETE_COMPANYGROUP_TYPE_ID, Delete_CompanyGroupType_ID_GenratorFunction)
  yield takeEvery(EDIT_COMPANYGROUP_TYPE_ID, Edit_CompanyGroupType_ID_GenratorFunction)
  yield takeEvery(UPDATE_COMPANYGROUP_TYPE_ID, Update_CompanyGroupType_ID_GenratorFunction)
}

export default CompanyGroupSaga;