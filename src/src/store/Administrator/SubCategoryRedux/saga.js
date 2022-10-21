import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForSubCategoryAPISuccess } from "./action";
import {
  POST_METHOD_HANDLER_FOR_SUBCATEGORY_API,
  GET_SUBCATEGORY_LIST,
  EDIT_SUBCATEGORY_ID,
  DELETE_SUBCATEGORY_ID,
  UPDATE_SUBCATEGORY_ID
} from "./actionTypes";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import {
  Post_SubCategory_API,
  detelet_SubCategory_List_Api,
  edit_SubCategory_List_Api,
  get_SubCategory_List_Api,
  update_SubCategory_List_Api

} from "../../../helpers/backend_helper";

import {
  deleteSubCategoryIDSuccess,
  editSubCategoryIDSuccess,
  getSubCategorylistSuccess,
  updateSubCategoryIDSuccess
} from "./action";

// post api
function* Post_Method_ForSubCategory_GenFun({ data }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_SubCategory_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForSubCategoryAPISuccess(response));
    console.log("response", response)
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// get api
function* Get_SubCategory_List_GenratorFunction() {
  yield put(SpinnerState(true))
  try {

    const response = yield call(get_SubCategory_List_Api);
    yield put(getSubCategorylistSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// delete api 
function* Delete_SubCategory_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_SubCategory_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteSubCategoryIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_SubCategory_ID_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_SubCategory_List_Api, id);
    response.pageMode=pageMode
    yield put(editSubCategoryIDSuccess(response));
    
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_SubCategory_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_SubCategory_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateSubCategoryIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* SubCategorySaga() {
  yield takeEvery(POST_METHOD_HANDLER_FOR_SUBCATEGORY_API, Post_Method_ForSubCategory_GenFun)
  yield takeEvery(GET_SUBCATEGORY_LIST, Get_SubCategory_List_GenratorFunction)
  yield takeEvery(DELETE_SUBCATEGORY_ID, Delete_SubCategory_ID_GenratorFunction)
  yield takeEvery(EDIT_SUBCATEGORY_ID, Edit_SubCategory_ID_GenratorFunction)
  yield takeEvery(UPDATE_SUBCATEGORY_ID, Update_SubCategory_ID_GenratorFunction)
}

export default SubCategorySaga;