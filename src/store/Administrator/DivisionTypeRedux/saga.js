import { call, put, takeEvery } from "redux-saga/effects";
import { detelet_DivisionType_List_Api, edit_DivisionType_List_Api, get_DivisionType_List_Api, Post_Division_Type_API, update_DivisionType_List_Api } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteDivisionTypeIDSuccess, editDivisionTypeSuccess, getDivisionTypelistSuccess, PostDivisionTypeSuccess, updateDivisionTypeIDSuccess } from "./action";
import { DELETE_DIVISION_TYPE_ID, EDIT_DIVISION_TYPE_ID, GET_DIVISION_TYPE_LIST, POST_DIVISION_TYPE_API, UPDATE_DIVISION_TYPE_ID } from "./actionType";

// post api
function* Post_Division_Type_GneratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_Division_Type_API, data);
    yield put(SpinnerState(false))
    yield put(PostDivisionTypeSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// get api
function* Get_DivisionType_List_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_DivisionType_List_Api);
    yield put(getDivisionTypelistSuccess(response.Data));
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
function* Delete_DivisionType_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_DivisionType_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteDivisionTypeIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_DivisionType_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(edit_DivisionType_List_Api, id);
    yield put(editDivisionTypeSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_DivisionType_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_DivisionType_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateDivisionTypeIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

  function* DivisionTypeSaga() {
    yield takeEvery(POST_DIVISION_TYPE_API, Post_Division_Type_GneratorFunction)
    yield takeEvery(GET_DIVISION_TYPE_LIST, Get_DivisionType_List_GenratorFunction)
    yield takeEvery(DELETE_DIVISION_TYPE_ID, Delete_DivisionType_ID_GenratorFunction)
    yield takeEvery(EDIT_DIVISION_TYPE_ID, Edit_DivisionType_ID_GenratorFunction)
    yield takeEvery(UPDATE_DIVISION_TYPE_ID, Update_DivisionType_ID_GenratorFunction)

  }
  
  export default DivisionTypeSaga;