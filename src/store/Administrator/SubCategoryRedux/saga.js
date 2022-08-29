import { call, put, takeEvery } from "redux-saga/effects";
import { getMethod_ForSubCategoryAPISuccess, PostMethod_ForSubCategoryAPISuccess} from "./action";
import { GET_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,
        POST_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,
        DELETE_SUBCATEGORY_MASTER_ID,
        EDIT_SUBCATEGORY_MASTER_ID,
        GET_SUBCATEGORY_MASTER_LIST,
        UPDATE_SUBCATEGORY_MASTER_ID
      } from "./actionTypes";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import { get_SubCategory_Master_API, 
         Post_SubCategory_Master_API,
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
function*  Post_Method_ForSubCategoryMaster_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_SubCategoryMaster_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForSubCategoryMasterAPISuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


///  ProductTypes dropdown list
function* get_Method_ForSubCategoryMaster_GenFun() {
  
  try {
    const response = yield call(get_SubCategoryMaster_Master_API);
    yield put(getMethod_ForSubCategoryMasterAPISuccess(response.Data));
    console.log("response",response)
  } catch (error) {
    console.log("Product Types API page error", error);
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
function* Edit_SubCategory_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(edit_SubCategory_List_Api, id);
    yield put(editSubCategoryIDSuccess(response));
    console.log("response in saga", response)

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




  function*  SubCategorySaga() {
    yield takeEvery(POST_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,  Post_Method_ForSubCategoryMaster_GenFun)
    yield takeEvery(GET_METHOD_HANDLER_FOR_SUBCATEGORY_MASTER_API,  get_Method_ForSubCategoryMaster_GenFun)
    yield takeEvery(GET_SUBCATEGORY_LIST, Get_SubCategory_List_GenratorFunction)
    yield takeEvery(DELETE_SUBCATEGORY_ID, Delete_SubCategory_ID_GenratorFunction)
    yield takeEvery(EDIT_SUBCATEGORY_ID, Edit_SubCategory_ID_GenratorFunction)
    yield takeEvery(UPDATE_SUBCATEGORY_ID, Update_SubCategory_ID_GenratorFunction)
  }
  
  export default SubCategorySaga;