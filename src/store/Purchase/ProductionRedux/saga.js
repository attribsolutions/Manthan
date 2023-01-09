import { call, put, takeEvery } from "redux-saga/effects";

import {
  delete_ProductionIdSuccess,
  getProductionistPageSuccess,
  getProduction_Mode2_Success,
  getUnitIDForProdunctionSuccess,
  post_ProductionSuccess,
  update_ProductionIdSuccess,
} from "./actions";
import {
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
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";

function* postProductionGenFunc({ data }) {
  yield put(SpinnerState(true));
  try {
    const response = yield call(Production_Post_API, data);
    yield put(post_ProductionSuccess(response));
    yield put(SpinnerState(false));
  } catch (error) {
    yield put(SpinnerState(false));
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error PostProduction",
      })
    );
  }
}

function* DeleteProductionGenFunc({ id }) {
  yield put(SpinnerState(true));
  try {
    const response = yield call(id);
    yield put(SpinnerState(false));
    yield put(delete_ProductionIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false));
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error DeleteGRN API",
      })
    );
  }
}

function* UpdateProductionGenFunc({ data, id }) {
  try {
    yield put(SpinnerState(true));
    const response = yield call(id);
    yield put(SpinnerState(false));
    yield put(update_ProductionIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false));
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 ErrorUpdateGRN API",
      })
    );
  }
}

// List Page API
function* get_PRODUCTION_GerFunc({ filters }) {
  yield put(SpinnerState(true));
  try {

    const response = yield call(production_get_API, filters);
    // const newList = yield response.Data.map((i) => {
    //   var date = convertDatefunc(i.GRNDate)
    //   var time = convertTimefunc(i.CreatedOn)
    //   i.GRNDate = (`${date} ${time}`)
    //   return i
    // })

    const newList = response.Data.map((index) => {
      debugger
      index.Item = index.Item.Name;
      var date = convertDatefunc(index.ProductionDate)
      var batchdate = convertDatefunc(index.BatchDate)
      var time = convertTimefunc(index.CreatedOn)
      var batchtime = convertTimefunc(index.CreatedOn)
      index.ProductionDate = (`${date} ${time}`)
      index.BatchDate = (`${batchdate} `)

      return index;
    });
    yield put(SpinnerState(false));
    yield put(getProductionistPageSuccess(newList));
  } catch (error) {
    yield put(SpinnerState(false));
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error get_PRODUCTION LIst API",
      })
    );
  }
}

// List Page API
function* getProduction_Mode2_GenFunc({ data }) {
  const { jsonBody, pageMode, path } = data;
  yield put(SpinnerState(true));
  try {
    const response = yield call(production_Make_API, jsonBody);
    response.Data = response.Data[0];
    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath

    yield put(SpinnerState(false));
    yield put(getProduction_Mode2_Success(response));
  } catch (error) {
    yield put(SpinnerState(false));
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error get_PRODUCTION Item API ",
      })
    );
  }
}

//  DesignationID dropdown list
function* UnitIDForProduction_saga({ data }) {
  debugger
  yield put(SpinnerState(true));
  try {
    const response = yield call(production_UnitDropdown_API, data);
    const UnitDropdown = response.Data.map((index) => ({
      value: index.UnitID,
      label: index.UnitName,
  }));
    yield put(getUnitIDForProdunctionSuccess(UnitDropdown));
    yield put(SpinnerState(false));
  } catch (error) {
    yield put(SpinnerState(false));
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error get Production Unit API ",
      })
    );
  }
}

function* ProductionSaga() {
  yield takeEvery(GET_PRODUCTION_ITEM_MODE_2, getProduction_Mode2_GenFunc);
  yield takeEvery(POST_PRODUCTION_FROM_PRODUCTION_PAGE, postProductionGenFunc);
  yield takeEvery(UPDATE_PRODUCTION_ID_FROM_PRODUCTION_PAGE, UpdateProductionGenFunc);
  yield takeEvery(DELETE_PRODUCTION_ID, DeleteProductionGenFunc);
  yield takeEvery(GET_PRODUCTION_LIST_PAGE, get_PRODUCTION_GerFunc);
  yield takeEvery(GET_UNIT_ID_FOR_PRODUNCTION, UnitIDForProduction_saga);
}
export default ProductionSaga;
