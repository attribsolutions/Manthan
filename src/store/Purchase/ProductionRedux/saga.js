import { call, put, takeEvery } from "redux-saga/effects";

import {
  deleteGRNIdSuccess,
  getGRNListPageSuccess,
  getGRN_itemMode2_Success,
  postGRNSuccess,
  updateGRNIdSuccess,

} from "./actions";
import {
  GRN_delete_API, 
  GRN_getItem_API,
  GRN_get_API, GRN_Post_API,
  GRN_update_API,
} from "../../../helpers/backend_helper";

import {
  DELETE_PRODUCTION_FOR_PRODUCTION_PAGE,
  DELETE_PRODUCTION_ID,
  GET_PRODUCTION_ITEM_MODE_2,
  GET_PRODUCTION_LIST_PAGE,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* postGRNGenFunc({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_Post_API, data);
    yield put(postGRNSuccess(response));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error postGRN API",
    }));
  }
}

function* DeleteGRNGenFunc({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_delete_API, id);
    yield put(SpinnerState(false))
    yield put(deleteGRNIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error DeleteGRN API",
    }));
  }
}

function* UpdateGRNGenFunc({ data, id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(GRN_update_API, data, id);
    yield put(SpinnerState(false))
    yield put(updateGRNIdSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 ErrorUpdateGRN API",
    }));
  }
}

// List Page API
function* get_PRODUCTION_GerFunc({ filters }) {
  
  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_get_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.GRNDate)
      var time = convertTimefunc(i.CreatedOn)
      i.GRNDate = (`${date} ${time}`)
      return i
    })
    yield put(SpinnerState(false))
    yield put(getGRNListPageSuccess(newList))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error get_PRODUCTION LIst API ",
    }));
  }
}

// List Page API
function* getGRNitem_Mode2_GenFunc({ data }) {
  
  const { jsonBody, pageMode, GRN_ADD, grnRef, challanNo } = data
  yield put(SpinnerState(true))
  try {
    // debugger
    const response = yield call(GRN_getItem_API, jsonBody);
    response.Data = response.Data[0];

    response["pageMode"] = pageMode;
    response.Data["GRNReferences"] = grnRef;
    response.Data["challanNo"] = challanNo;
    response["path"] = GRN_ADD; //Pagepath
    // debugger
    yield put(SpinnerState(false))
    yield put(getGRN_itemMode2_Success(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error get_PRODUCTION Item API ",
    }));
  }
}
function* ProductionSaga() {

  yield takeEvery(GET_PRODUCTION_ITEM_MODE_2, getGRNitem_Mode2_GenFunc);
  yield takeEvery(POST_PRODUCTION_FROM_PRODUCTION_PAGE, postGRNGenFunc);
  // yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editGRNGenFunc);
  yield takeEvery(UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE, UpdateGRNGenFunc)
  yield takeEvery(DELETE_PRODUCTION_ID, DeleteGRNGenFunc);
  yield takeEvery(GET_PRODUCTION_LIST_PAGE, get_PRODUCTION_GerFunc);
}

export default ProductionSaga;
