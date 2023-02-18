import { call, put, takeEvery } from "redux-saga/effects";

import {
  deleteChallanIdSuccess,
  deleteGRNIdSuccess,
  getChallanListPageSuccess,
  getGRNListPageSuccess,
  makechallanSuccess,
  

} from "./actions";
import {
  Challan_delete_API,
  Challan_get_API,
  Challan_Make_API,
  GRN_delete_API, 
  GRN_get_API, 
} from "../../../helpers/backend_helper";

import {
  DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  DELETE_CHALLAN_FOR_GRN_PAGE,
  DELETE_GRN_FOR_GRN_PAGE,
  GET_CHALLAN_LIST_PAGE,
  GET_GRN_LIST_PAGE,
  MAKE_CHALLAN_GET_API,
} from "./actionType";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


function* DeleteChallanGenFunc({ id }) {
  try {
    const response = yield call(Challan_delete_API, id);
   
    yield put(deleteChallanIdSuccess(response));
  } catch (error) {
   
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error DeleteChallan API",
    }));
  }
};

//  Make challan API
function* Make_Challan_GerFunc({ id }) {
  debugger
  try {
    const response = yield call(Challan_Make_API, id);
    debugger
    yield put(makechallanSuccess(response))
    debugger

  } catch (error) {
    // yield put(AlertState({
    //   Type: 4,
    //   Status: true, Message: "500 Error get_challan List API ",
    // }));
  }
}

// List Page API
function* get_Challan_GerFunc({ filters }) {
  try {
    const response = yield call(Challan_get_API, filters);
    debugger
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.ChallanDate)
      var time = convertTimefunc(i.CreatedOn)
      i.ChallanDate = (`${date} ${time}`)
      return i
    })
    yield put(getChallanListPageSuccess(newList))

  } catch (error) {
  
    // yield put(AlertState({
    //   Type: 4,
    //   Status: true, Message: "500 Error get_challan List API ",
    // }));
  }
}

// List Page API

function* ChallanSaga() {
  yield takeEvery(MAKE_CHALLAN_GET_API, Make_Challan_GerFunc);
  yield takeEvery(DELETE_CHALLAN_FOR_CHALLAN_PAGE, DeleteChallanGenFunc);
  yield takeEvery(GET_CHALLAN_LIST_PAGE, get_Challan_GerFunc);
}

export default ChallanSaga;
