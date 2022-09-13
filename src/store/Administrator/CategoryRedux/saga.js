import { call, put, takeEvery } from "redux-saga/effects";
import { getMethod_ForCategoryAPISuccess,  PostMethod_ForCategoryAPISuccess} from "./action";
import { GET_METHOD_HANDLER_FOR_CATEGORY,
        POST_METHOD_HANDLER_FOR_CATEGORY_API,
        DELETE_CATEGORY_ID,
        EDIT_CATEGORY_ID,
        GET_CATEGORY_LIST,
        UPDATE_CATEGORY_ID
      } from "./actionTypes";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import { get_Category_Master_API, 
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



// post api
function*  Post_Method_ForCategory_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_Category_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForCategoryAPISuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


///  ProductTypes dropdown list
function* get_Method_ForCategory_GenFun() {
  
  try {
    const response = yield call(get_Category_Master_API);
    yield put(getMethod_ForCategoryAPISuccess(response.Data));
    console.log("response",response)
  } catch (error) {
    console.log("Product Types API page error", error);
  }
}


// get api
function* Get_Category_List_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    
    const response = yield call(get_Category_List_Api);
    yield put(getCategorylistSuccess(response.Data));
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
function* Delete_Category_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_Category_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteCategoryIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_Category_ID_GenratorFunction({ id,pageMode }) {
  try {
    const response = yield call(edit_Category_List_Api, id);
    response.pageMode=pageMode
    yield put(editCategoryIDSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_Category_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_Category_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateCategoryIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}




  function*  CategorySaga() {
    yield takeEvery( POST_METHOD_HANDLER_FOR_CATEGORY_API,Post_Method_ForCategory_GenFun)
    yield takeEvery(GET_METHOD_HANDLER_FOR_CATEGORY, get_Method_ForCategory_GenFun)
    yield takeEvery(GET_CATEGORY_LIST, Get_Category_List_GenratorFunction)
    yield takeEvery(DELETE_CATEGORY_ID, Delete_Category_ID_GenratorFunction)
    yield takeEvery(EDIT_CATEGORY_ID, Edit_Category_ID_GenratorFunction)
    yield takeEvery(UPDATE_CATEGORY_ID, Update_Category_ID_GenratorFunction)
  }
  
  export default CategorySaga;