import { call, put, takeEvery } from "redux-saga/effects";
import { PostMethod_ForProductCategoryTypeMasterAPISuccess, PostProductCategoryTypeMasterAPISuccess} from "./action";
import { POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API, POST_PRODUCT_CATEGORY_TYPE_MASTER_API} from "./actionTypes";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { Post_Product_Category_Type_Master_API} from "../../../helpers/backend_helper";

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



  function*  ProductCategoryTypeMasterSaga() {
    yield takeEvery(POST_METHOD_HANDLER_FOR_PRODUCT_CATEGORY_TYPE_MASTER_API,  Post_Method_ForProductCategoryTypeMaster_GenFun)
  }
  
  export default ProductCategoryTypeMasterSaga;