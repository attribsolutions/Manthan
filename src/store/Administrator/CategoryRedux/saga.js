import { call, put, takeEvery } from "redux-saga/effects";
import {
  SAVE_CATEGORY_MASTER,
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
  categoryApiErrorAction,
  deleteCategoryIDSuccess,
  editCategoryIDSuccess,
  getCategorylistSuccess,
  saveCategoryMaster_Success,
  updateCategoryIDSuccess
} from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* save_Method_ForCategory_GenFun({ config }) {              // Save API
  try {
    const response = yield call(Post_Category_API, config);
    yield put(saveCategoryMaster_Success(response));
  } catch (error) { yield put(categoryApiErrorAction()) }
}

function* Get_Category_List_GenratorFunction() {                    // getList API
  try {
    const response = yield call(get_Category_List_Api);
    yield put(getCategorylistSuccess(response.Data));
  } catch (error) { yield put(categoryApiErrorAction()) }
}

function* Delete_Category_ID_GenratorFunction({ config }) {          // delete API
  try {
    const response = yield call(detelet_Category_List_Api, config);
    yield put(deleteCategoryIDSuccess(response))
  } catch (error) { yield put(categoryApiErrorAction()) }
}

function* Edit_Category_ID_GenratorFunction({ config }) {           // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(edit_Category_List_Api, config);
    response.pageMode = btnmode;
    yield put(editCategoryIDSuccess(response));
  } catch (error) { yield put(categoryApiErrorAction()) }
}


function* Update_Category_ID_GenratorFunction({ config }) {         // update API
  try {
    const response = yield call(update_Category_List_Api, config);
    yield put(updateCategoryIDSuccess(response))
  } catch (error) { yield put(categoryApiErrorAction()) }
}

function* CategorySaga() {
  yield takeEvery(SAVE_CATEGORY_MASTER, save_Method_ForCategory_GenFun)
  yield takeEvery(GET_CATEGORY_LIST, Get_Category_List_GenratorFunction)
  yield takeEvery(DELETE_CATEGORY_ID, Delete_Category_ID_GenratorFunction)
  yield takeEvery(EDIT_CATEGORY_ID, Edit_Category_ID_GenratorFunction)
  yield takeEvery(UPDATE_CATEGORY_ID, Update_Category_ID_GenratorFunction)
}

export default CategorySaga;