import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForCategoryAPISuccess } from "./action";
import {
  POST_METHOD_HANDLER_FOR_CATEGORY_API,
  DELETE_CATEGORY_ID,
  EDIT_CATEGORY_ID,
  GET_CATEGORY_LIST,
  UPDATE_CATEGORY_ID
} from "./actionTypes";
import {
  Post_Category_API,
  detelet_Category_List_Api,
  edit_Category_List_Api,
  get_Category_List_Api,
  update_Category_List_Api
} from "../../../helpers/backend_helper";
import {
  deleteCategoryIDSuccess,
  editCategoryIDSuccess,
  getCategorylistSuccess,
  updateCategoryIDSuccess
} from "./action";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

// post api
function* Post_Method_ForCategory_GenFun({ data }) {
  try {
    const response = yield call(Post_Category_API, data);
    yield put(PostMethod_ForCategoryAPISuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get api
function* Get_Category_List_GenratorFunction() {
  try {
    const response = yield call(get_Category_List_Api);
    yield put(getCategorylistSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api 
function* Delete_Category_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(detelet_Category_List_Api, id);
    yield put(deleteCategoryIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_Category_ID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_Category_List_Api, id);
    response.pageMode = pageMode
    yield put(editCategoryIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_Category_ID_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_Category_List_Api, updateData, ID);
    yield put(updateCategoryIDSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* CategorySaga() {
  yield takeEvery(POST_METHOD_HANDLER_FOR_CATEGORY_API, Post_Method_ForCategory_GenFun)
  yield takeEvery(GET_CATEGORY_LIST, Get_Category_List_GenratorFunction)
  yield takeEvery(DELETE_CATEGORY_ID, Delete_Category_ID_GenratorFunction)
  yield takeEvery(EDIT_CATEGORY_ID, Edit_Category_ID_GenratorFunction)
  yield takeEvery(UPDATE_CATEGORY_ID, Update_Category_ID_GenratorFunction)
}

export default CategorySaga;