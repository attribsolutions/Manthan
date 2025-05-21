import { call, put, takeLatest } from "redux-saga/effects";

import {
  delete_ProductionIdSuccess,
  edit_ProductionIdSuccess,
  getProductionistPageSuccess,
  getProduction_Mode2_Success,
  getUnitIDForProdunctionSuccess,
  Save_ProductionSuccess,
  update_ProductionIdSuccess,
  ProductionApiErrorAction,
} from "./actions";
import {
  Production_Delete_API,
  production_Edit_API,
  production_get_API,
  production_Make_API,
  Production_Post_API,
  production_UnitDropdown_API,
} from "../../../helpers/backend_helper";

import {
  DELETE_PRODUCTION_ID,
  GET_PRODUCTION_ITEM_MODE_2,
  GET_PRODUCTION_LIST_PAGE,
  POST_PRODUCTION_FROM_PRODUCTION_PAGE,
  GET_UNIT_ID_FOR_PRODUNCTION,
  UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE,
  EDIT_PRODUCTION_FOR_PRODUCTION_PAGE,
} from "./actionType";

import { date_dmy_func, convertTimefunc, listpageConcatDateAndTime } from "../../../components/Common/CommonFunction";

function* SaveProductionGenFunc({ config }) {
  try {
    const response = yield call(Production_Post_API, config);
    yield put(Save_ProductionSuccess(response));
  } catch (error) { yield put(ProductionApiErrorAction()) }
}

function* DeleteProductionGenFunc({ config }) {
  try {
    const response = yield call(Production_Delete_API, config);
    yield put(delete_ProductionIdSuccess(response));
  } catch (error) { yield put(ProductionApiErrorAction()) }
}

function* UpdateProductionGenFunc({ config }) {
  try {
    const response = yield call(config);
    yield put(update_ProductionIdSuccess(response));
  } catch (error) { yield put(ProductionApiErrorAction()) }
}

// List Page API
function* get_PRODUCTION_GerFunc({ filters }) {

  try {
    const response = yield call(production_get_API, filters);
    const newList = response.Data.map((index) => {
      // index.Item = index.Item;

      var date = date_dmy_func(index.ProductionDate)
      var batchdate = date_dmy_func(index.BatchDate)
      var time = convertTimefunc(index.CreatedOn)

      index["transactionDate"] = index.CreatedOn
      index["transactionDateLabel"] = (`${date} ${time}`)
      index.BatchDate = (`${batchdate} `)
      return index;
    });
    yield put(getProductionistPageSuccess(newList));
  } catch (error) { yield put(ProductionApiErrorAction()) }
}

// List Page API
function* getProduction_Mode2_GenFunc({ data }) {
  const { jsonBody, pageMode, path } = data;
  try {
    const response = yield call(production_Make_API, jsonBody);
    response.Data = response.Data[0];
    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath
    yield put(getProduction_Mode2_Success(response));
  } catch (error) { yield put(ProductionApiErrorAction()) }
}

// Edit Production  Page API
function* editProduction_GenFunc({ config }) {
  const { btnmode } = config;
  try {
    const response = yield call(production_Edit_API, config);
    response.pageMode = btnmode;
    yield put(edit_ProductionIdSuccess(response));
  } catch (error) { yield put(ProductionApiErrorAction()) }
};

//  DesignationID dropdown list
function* UnitIDForProduction_saga({ data }) {
  try {
    const response = yield call(production_UnitDropdown_API, data);
    const UnitDropdown = response.Data.map((index) => ({
      value: index.id,
      label: index.UnitName,
    }));
    yield put(getUnitIDForProdunctionSuccess(UnitDropdown));
  } catch (error) { yield put(ProductionApiErrorAction()) }
}

function* ProductionSaga() {
  yield takeLatest(GET_PRODUCTION_ITEM_MODE_2, getProduction_Mode2_GenFunc);
  yield takeLatest(EDIT_PRODUCTION_FOR_PRODUCTION_PAGE, editProduction_GenFunc);
  yield takeLatest(POST_PRODUCTION_FROM_PRODUCTION_PAGE, SaveProductionGenFunc);
  yield takeLatest(UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE, UpdateProductionGenFunc);
  yield takeLatest(DELETE_PRODUCTION_ID, DeleteProductionGenFunc);
  yield takeLatest(GET_PRODUCTION_LIST_PAGE, get_PRODUCTION_GerFunc);
  yield takeLatest(GET_UNIT_ID_FOR_PRODUNCTION, UnitIDForProduction_saga);
}
export default ProductionSaga;
