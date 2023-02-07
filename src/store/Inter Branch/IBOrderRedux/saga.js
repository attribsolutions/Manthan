import { call, delay, put, takeEvery } from "redux-saga/effects";
import { convertDatefunc, convertTimefunc, GoBtnDissable, saveDissable } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import {
    IBOrderList_get_Filter_API,

    IBOrderPage_Delete_API,
    IBOrderPage_Edit_API,
    IBOrderPage_GoButton_API,
    IBOrderPage_Post_API,
    IBOrderPage_Update_API,
    Division,
} from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {

    postGoButtonForIBOrderSuccess,
    postIBOrderSuccess,
    postDivisionSuccess,
    editIBOrderIdSuccess,
    deleteIBOrderIdSuccess,
    updateIBOrderIdSuccess,
    postIBOrderListPageSuccess,

} from "./action";
import {

    POST_GO_BUTTON_FOR_IBORDER,
    POST_IBORDER,
    POST_IBORDER_LIST_PAGE,
    UPDATE_IBORDER_ID_FROM_IBORDER_PAGE,
    EDIT_IBORDER_FOR_IBORDER_PAGE,
    DELETE_IBORDER_FOR_IBORDER_PAGE,
    POST_DIVISION,
} from "./actionType";


// GO Botton Post API

function* GoButton_IBOrder_genfun({ data }) {
  try {
    const response = yield call(IBOrderPage_GoButton_API, data);
    yield put(postGoButtonForIBOrderSuccess(response.Data));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Go Button-IBOrder Page",
    }));
  }
};

//post api

function* Post_IBOrder_Genfun({ data }) {
  
  
    try {
        const response = yield call(IBOrderPage_Post_API,data);
       
        yield put(postIBOrderSuccess(response));
    } catch (error) {
       
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}

//division  api
function* post_Division_Genfun({ data }) {
  
    try {
        const response = yield call(Division, data);
       
      yield put(postDivisionSuccess(response.Data));
    } catch (error) {
       
        yield put(AlertState({
            Type: 4,
            Status: true, Message: "500 Error Message",
        }));
    }
}



function* editIBOrderGenFunc({ jsonBody, pageMode }) {

  
    try {
      const response = yield call(IBOrderPage_Edit_API, jsonBody);

      response.pageMode = pageMode
     
      yield put(editIBOrderIdSuccess(response));
    } catch (error) {
     
      yield put(AlertState({
        Type: 4,

        Status: true, Message: "500 Error Edit IBOrder",

      }));
    }
  }
  

  function* DeleteIBOrder_GenFunc({ id }) {
  
    try {
      const response = yield call(IBOrderPage_Delete_API, id);
     
      yield put(deleteIBOrderIdSuccess(response));
    } catch (error) {
     
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Delete IBOrder",
      }));
    }
  }
  

  function* UpdateIBOrder_ID_GenFunc({ data, id }) {
  
    try {
      yield saveDissable(true)
      const response = yield call(IBOrderPage_Update_API, data, id);
      yield put(updateIBOrderIdSuccess(response))
      yield saveDissable(false)
    }
    catch (error) {
      yield saveDissable(false)
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error UpdateIBOrder",
      }));
    }
  }
  
  // List Page API
  function* Post_IBOrderList_GenFunc({ filters }) {
  
  try {

    const response = yield call(IBOrderList_get_Filter_API, filters);
    const newList = yield response.Data.map((i) => {
      i.IBOrderDate = i.IBOrderDate;
      var time = convertTimefunc(i.CreatedOn)
      var date = convertDatefunc(i.IBOrderDate)
      i.IBOrderDate = (`${date} ${time}`)
      return i
    })
    yield put(postIBOrderListPageSuccess(newList));
   
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message in IBOrderList ",
    }));
  }
}
  

function* IBOrderSaga() {

    yield takeEvery(POST_GO_BUTTON_FOR_IBORDER, GoButton_IBOrder_genfun)
    yield takeEvery(POST_IBORDER, Post_IBOrder_Genfun)
    yield takeEvery(POST_DIVISION, post_Division_Genfun)
    yield takeEvery(EDIT_IBORDER_FOR_IBORDER_PAGE, editIBOrderGenFunc)
    yield takeEvery(DELETE_IBORDER_FOR_IBORDER_PAGE, DeleteIBOrder_GenFunc)
    yield takeEvery(POST_IBORDER_LIST_PAGE, Post_IBOrderList_GenFunc)
    yield takeEvery(UPDATE_IBORDER_ID_FROM_IBORDER_PAGE, UpdateIBOrder_ID_GenFunc)

}

export default IBOrderSaga;