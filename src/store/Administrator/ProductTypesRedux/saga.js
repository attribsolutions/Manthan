import { call, put, takeEvery } from "redux-saga/effects";
import { getMethod_ForProductTypesAPISuccess, PostMethod_ForProductTypesAPISuccess} from "./action";
import { GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API} from "./actionTypes";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { get_Product_Category_Type_Master_API, Post_Product_Types_API} from "../../../helpers/backend_helper";

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
  debugger
  try {
    const response = yield call(get_Product_Category_Type_Master_API);
    yield put(getMethod_ForProductTypesAPISuccess(response.Data));
    console.log("response",response)
  } catch (error) {
    console.log("Product Types API page error", error);
  }
}

  function*  ProductTypesSaga() {
    yield takeEvery(POST_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,  Post_Method_ForProductTypes_GenFun)
    yield takeEvery(GET_METHOD_HANDLER_FOR_PRODUCT_TYPES_API,  get_Method_ForProductTypes_GenFun)

  }
  
  export default ProductTypesSaga;