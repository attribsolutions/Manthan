import { call, put, takeEvery } from "redux-saga/effects";
import { SpinnerState } from "../../Utilites/Spinner/actions";
 import { PostMethod_ForDriverMasterSuccess, getMethod_ForDriverListSuccess,  deleteDriverTypeIDSuccess, editDriverTypeSuccess, updateDriverTypeIDSuccess} from "./action";
import {
   get_DriverList_API,
   Post_Driver_API,
   detelet_DriverType_List_Api,
   edit_DriverType_List_Api,
   update_DriverType_List_Api,
} from "../../../helpers/backend_helper";

import { POST_METHOD_FOR_DRIVER_MASTER,
  GET_METHOD_FOR_DRIVER_LIST,
  DELETE_DRIVER_TYPE_ID,
  EDIT_DRIVER_TYPE_ID,
  UPDATE_DRIVER_TYPE_ID

} from "./actionType";
import { AlertState } from "../../actions";
import { PaginationListStandalone } from "react-bootstrap-table2-paginator";

// Get List Page API
function* Get_Driver_GenratorFunction() {

  try {
    const response = yield call(get_DriverList_API);
    yield put(getMethod_ForDriverListSuccess(response.Data));
   
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// post api
function* Post_Method_For_Driver_GenFun({ data }) {

  try {
    const response = yield call(Post_Driver_API, data);
   
    yield put(PostMethod_ForDriverMasterSuccess(response));
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}




// delete api 
function* Delete_DriverType_ID_GenratorFunction({ id }) {
  try {
  
    const response = yield call(detelet_DriverType_List_Api, id);
   
    yield put(deleteDriverTypeIDSuccess(response))
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_DriverType_ID_GenratorFunction({ id ,pageMode}) {
  try {
    const response = yield call(edit_DriverType_List_Api, id);
    response.pageMode=pageMode
    yield put(editDriverTypeSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_DriverType_ID_GenratorFunction({ updateData, ID }) {
  try {
  
    const response = yield call(update_DriverType_List_Api, updateData, ID);
   
    yield put(updateDriverTypeIDSuccess(response))
  }
  catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}



function* DriverSaga() {
  yield takeEvery(POST_METHOD_FOR_DRIVER_MASTER, Post_Method_For_Driver_GenFun)
  yield takeEvery(GET_METHOD_FOR_DRIVER_LIST, Get_Driver_GenratorFunction)
  yield takeEvery(DELETE_DRIVER_TYPE_ID, Delete_DriverType_ID_GenratorFunction)
  yield takeEvery(EDIT_DRIVER_TYPE_ID, Edit_DriverType_ID_GenratorFunction)
  yield takeEvery(UPDATE_DRIVER_TYPE_ID, Update_DriverType_ID_GenratorFunction)
}

export default DriverSaga;