import { call, put, takeEvery } from "redux-saga/effects";

import {
  delete_ProductionIdSuccess,
  getProductionistPageSuccess,
  getProduction_Mode2_Success,
  post_ProductionSuccess,
  update_ProductionIdSuccess,
} from "./actions";
import {
  production_get_API,
  production_Make_API,
  Production_Post_API,
} from "../../../helpers/backend_helper";

import {
  DELETE_PRODUCTION_ID,
  GET_PRODUCTION_ITEM_MODE_2,
  GET_PRODUCTION_LIST_PAGE,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* postProductionGenFunc({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Production_Post_API, data);
    yield put(post_ProductionSuccess(response));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error PostProduction",
    }));
  }
}

function* DeleteProductionGenFunc({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call( id);
    yield put(SpinnerState(false))
    yield put(delete_ProductionIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error DeleteGRN API",
    }));
  }
}

function* UpdateProductionGenFunc({ data, id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call( id);
    yield put(SpinnerState(false))
    yield put(update_ProductionIdSuccess(response))
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
    debugger
    const response = yield call(production_get_API, filters);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.GRNDate)
      var time = convertTimefunc(i.CreatedOn)
      i.GRNDate = (`${date} ${time}`)
      return i
    })
    yield put(SpinnerState(false))
    yield put(getProductionistPageSuccess(newList))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error get_PRODUCTION LIst API",
    }));
  }
}

// List Page API
function* getProduction_Mode2_GenFunc({ data }) {
  debugger
  const { jsonBody, pageMode,path } = data
  yield put(SpinnerState(true))
  try {
    const response = yield call(production_Make_API, jsonBody);
    response.Data = response.Data[0];
    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath

    yield put(SpinnerState(false))
    yield put(getProduction_Mode2_Success(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error get_PRODUCTION Item API ",
    }));
  }
}
function* ProductionSaga() {
  yield takeEvery(GET_PRODUCTION_ITEM_MODE_2, getProduction_Mode2_GenFunc);
  yield takeEvery(POST_PRODUCTION_FROM_PRODUCTION_PAGE, postProductionGenFunc);
  yield takeEvery(UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE, UpdateProductionGenFunc)
  yield takeEvery(DELETE_PRODUCTION_ID, DeleteProductionGenFunc);
  yield takeEvery(GET_PRODUCTION_LIST_PAGE, get_PRODUCTION_GerFunc);
}
export default ProductionSaga;
