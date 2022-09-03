import { call, put, takeEvery } from "redux-saga/effects";
import { getMethod_ForProductTypesAPISuccess, PostMethod_ForProductTypesAPISuccess} from "./action";
import { GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
        POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,
        DELETE_PRODUCT_TYPES_ID,
        EDIT_PRODUCT_TYPES_ID,
        GET_PRODUCT_TYPES_LIST,
        UPDATE_PRODUCT_TYPES_ID
      } from "./actionTypes";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import { get_Product_Category_Type_Master_API, 
         Post_Product_Types_API,
         detelet_Product_Types_List_Api,
         edit_Product_Types_List_Api,
         get_Product_Types_List_Api,
         update_Product_Types_List_Api
     } from "../../../helpers/backend_helper";
  
import {
  deleteProductTypesIDSuccess,
  editProductTypesIDSuccess,
  getProductTypeslistSuccess,
  updateProductTypesIDSuccess
} from "./action";



// post api
function*  Post_Method_ForProductTypes_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_Product_Types_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForProductTypesAPISuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


///  ProductTypes dropdown list
function* get_Method_ForProductTypes_GenFun() {
  
  try {
    const response = yield call(get_Product_Category_Type_Master_API);
    yield put(getMethod_ForProductTypesAPISuccess(response.Data));
    console.log("response",response)
  } catch (error) {
    console.log("Product Types API page error", error);
  }
}


// get api
function* Get_ProductTypes_List_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    
    const response = yield call(get_Product_Types_List_Api);
    yield put(getProductTypeslistSuccess(response.Data));
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
function* Delete_ProductTypes_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_Product_Types_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteProductTypesIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_ProductTypes_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(edit_Product_Types_List_Api, id);
    yield put(editProductTypesIDSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_ProductTypes_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_Product_Types_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateProductTypesIDSuccess(response))
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
    yield takeEvery(POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,Post_Method_ForProductTypes_GenFun)
    yield takeEvery(GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API, get_Method_ForProductTypes_GenFun)
    yield takeEvery(GET_PRODUCT_TYPES_LIST, Get_ProductTypes_List_GenratorFunction)
    yield takeEvery(DELETE_PRODUCT_TYPES_ID, Delete_ProductTypes_ID_GenratorFunction)
    yield takeEvery(EDIT_PRODUCT_TYPES_ID, Edit_ProductTypes_ID_GenratorFunction)
    yield takeEvery(UPDATE_PRODUCT_TYPES_ID, Update_ProductTypes_ID_GenratorFunction)
  }
  
  export default CategorySaga;