import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForCategoryTypeMasterAPISuccess, } from "./actions";
import {
  deleteCategoryTypeIDSuccess,
  editCategoryTypeIDSuccess,
  getCategoryTypelistSuccess,
  updateCategoryTypeIDSuccess
} from "./actions";
import {
  detelet_CategoryType_List_Api,
  edit_CategoryType_List_Api,
  get_CategoryType_List_Api,
  Post_Category_Type_Master_API,
  update_CategoryType_List_Api
} from "../../../helpers/backend_helper";

import {
  DELETE_CATEGORY_TYPE_ID,
  EDIT_CATEGORY_TYPE_ID,
  GET_CATEGORY_TYPE_LIST,
  POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API,
  UPDATE_CATEGORY_TYPE_ID
} from "./actionTypes";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

// post api
function* Post_Method_ForCategoryTypeMaster_GenFun({ data }) {
  try {
    const response = yield call(Post_Category_Type_Master_API, data);
    yield put(PostMethod_ForCategoryTypeMasterAPISuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get api
function* Get_CategoryType_List_GenratorFunction() {
  try {
    const response = yield call(get_CategoryType_List_Api);
    yield put(getCategoryTypelistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_CategoryType_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(detelet_CategoryType_List_Api, id);
    yield put(deleteCategoryTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_CategoryType_ID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_CategoryType_List_Api, id);
    response.pageMode = pageMode
    yield put(editCategoryTypeIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_CategoryType_ID_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_CategoryType_List_Api, updateData, ID);
    yield put(updateCategoryTypeIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* CategoryTypeSaga() {
  yield takeEvery(POST_METHOD_HANDLER_FOR_CATEGORY_TYPE_MASTER_API, Post_Method_ForCategoryTypeMaster_GenFun)
  yield takeEvery(GET_CATEGORY_TYPE_LIST, Get_CategoryType_List_GenratorFunction)
  yield takeEvery(DELETE_CATEGORY_TYPE_ID, Delete_CategoryType_ID_GenratorFunction)
  yield takeEvery(EDIT_CATEGORY_TYPE_ID, Edit_CategoryType_ID_GenratorFunction)
  yield takeEvery(UPDATE_CATEGORY_TYPE_ID, Update_CategoryType_ID_GenratorFunction)

}

export default CategoryTypeSaga;