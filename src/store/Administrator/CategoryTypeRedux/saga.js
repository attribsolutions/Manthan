import { call, put, takeEvery } from "redux-saga/effects";
import {
  saveCategoryTypeMaster_Success,
  deleteCategoryTypeIDSuccess,
  editCategoryTypeIDSuccess,
  getCategoryTypelistSuccess,
  updateCategoryTypeIDSuccess,
  categoryTypeApiErrorAction
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
  SAVE_CATEGORYTYPE_MASTER,
  UPDATE_CATEGORY_TYPE_ID
} from "./actionTypes";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* Save_Method_ForCategoryTypeMaster_GenFun({ config }) {             // Save API
  try {
    const response = yield call(Post_Category_Type_Master_API, config);
    yield put(saveCategoryTypeMaster_Success(response));
  } catch (error) { yield put(categoryTypeApiErrorAction()) }
}

function* Get_CategoryType_List_GenratorFunction() {                        // getList API
  try {
    const response = yield call(get_CategoryType_List_Api);
    yield put(getCategoryTypelistSuccess(response.Data));
  } catch (error) { yield put(categoryTypeApiErrorAction()) }
}

function* Delete_CategoryType_ID_GenratorFunction({ config }) {              // delete API
  try {
    const response = yield call(detelet_CategoryType_List_Api, config);
    yield put(deleteCategoryTypeIDSuccess(response))
  } catch (error) { yield put(categoryTypeApiErrorAction()) }
}

function* Edit_CategoryType_ID_GenratorFunction({ config }) {                 // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_CategoryType_List_Api, config);
    response.pageMode = btnmode;
    yield put(editCategoryTypeIDSuccess(response));
  } catch (error) { yield put(categoryTypeApiErrorAction()) }
}

function* Update_CategoryType_ID_GenratorFunction({ config }) {             // update API
  try {
    const response = yield call(update_CategoryType_List_Api, config);
    yield put(updateCategoryTypeIDSuccess(response))
  } catch (error) { yield put(categoryTypeApiErrorAction()) }
}

function* CategoryTypeSaga() {
  yield takeEvery(SAVE_CATEGORYTYPE_MASTER, Save_Method_ForCategoryTypeMaster_GenFun)
  yield takeEvery(GET_CATEGORY_TYPE_LIST, Get_CategoryType_List_GenratorFunction)
  yield takeEvery(DELETE_CATEGORY_TYPE_ID, Delete_CategoryType_ID_GenratorFunction)
  yield takeEvery(EDIT_CATEGORY_TYPE_ID, Edit_CategoryType_ID_GenratorFunction)
  yield takeEvery(UPDATE_CATEGORY_TYPE_ID, Update_CategoryType_ID_GenratorFunction)
}

export default CategoryTypeSaga;