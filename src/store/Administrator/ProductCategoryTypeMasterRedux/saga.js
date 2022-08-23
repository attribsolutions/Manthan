import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForProductCategoryTypeMasterAPISuccess, } from "./action";
import { POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API, } from "./actionTypes";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import {  PostMethod_ForProductCategoryTypeMasterAPISuccess, } from "./action";
import { POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API,POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API} from "./actionTypes";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { Post_Product_Category_Type_Master_API} from "../../../helpers/backend_helper";
import { deleteProductCategoryTypeIDSuccess, editProductCategoryTypeIDSuccess, getProductCategoryTypelistSuccess, PostMethod_ForProductCategoryTypeMasterAPISuccess, updateProductCategoryTypeIDSuccess } from "./action";
import { DELETE_PRODUCT_CATEGORY_TYPE_ID, EDIT_PRODUCT_CATEGORY_TYPE_ID, GET_PRODUCT_CATEGORY_TYPE_LIST, POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API, UPDATE_PRODUCT_CATEGORY_TYPE_ID } from "./actionTypes";

// post api
function*  Post_Method_ForProductCategoryTypeMaster_GenFun({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_Product_Category_Type_Master_API, data);
    yield put(SpinnerState(false))
    yield put(PostMethod_ForProductCategoryTypeMasterAPISuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// get api
function* Get_ProductCategoryType_List_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_ProductCategoryType_List_Api);
    yield put(getProductCategoryTypelistSuccess(response.Data));
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
function* Delete_ProductCategoryType_ID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(detelet_ProductCategoryType_List_Api, id);
    yield put(SpinnerState(false))
    yield put(deleteProductCategoryTypeIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_ProductCategoryType_ID_GenratorFunction({ id }) {
  try {
    const response = yield call(edit_ProductCategoryType_List_Api, id);
    yield put(editProductCategoryTypeIDSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_ProductCategoryType_ID_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_ProductCategoryType_List_Api, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateProductCategoryTypeIDSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


  function*  ProductCategoryTypeMasterSaga() {
    yield takeEvery(POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API,  Post_Method_ForProductCategoryTypeMaster_GenFun)
    yield takeEvery(GET_PRODUCT_CATEGORY_TYPE_LIST, Get_ProductCategoryType_List_GenratorFunction)
    yield takeEvery(DELETE_PRODUCT_CATEGORY_TYPE_ID, Delete_ProductCategoryType_ID_GenratorFunction)
    yield takeEvery(EDIT_PRODUCT_CATEGORY_TYPE_ID, Edit_ProductCategoryType_ID_GenratorFunction)
    yield takeEvery(UPDATE_PRODUCT_CATEGORY_TYPE_ID, Update_ProductCategoryType_ID_GenratorFunction)

  }
  
  export default ProductCategoryTypeMasterSaga;