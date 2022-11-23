import { call, put, takeEvery } from "redux-saga/effects";

import {
  deleteGRNIdSuccess,
  editGRNIdSuccess,
  getGRNListPageSuccess,
  getGRN_itemMode2_Success,
  getGRN_itemMode3_Success,
  postGRNSuccess,
  updateGRNIdSuccess,

} from "./actions";
import {
  GRN_delete_API, GRN_Edit_API,
  GRN_getItem_API,
  GRN_get_API, GRN_Post_API,
  GRN_update_API,
} from "../../../helpers/backend_helper";

import {
  DELETE_GRN_FOR_GRN_PAGE,
  GET_GRN_ITEM_MODE_2,
  GET_GRN_LIST_PAGE,
  POST_GRN_FROM_GRN_PAGE,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
} from "./actionType";

import { SpinnerState } from "../../Utilites/Spinner/actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { EDIT_ORDER_FOR_ORDER_PAGE } from "../OrderPageRedux/actionType";

function* postGRNGenFunc({ data }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_Post_API, data);
    debugger
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

function* editGRNGenFunc({ id, pageMode }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_Edit_API, id);
    response.pageMode = pageMode
    yield put(SpinnerState(false))
    // debugger
    yield put(editGRNIdSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error EditGRN-ID API",
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
function* get_GRN_GerFunc() {

  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_get_API);
    // const convertList = response.Data.map(i => {
    //   delete i.age
    //   id,
    //   GRNDate,
    //   Customer,
    //   GRNNumber,
    //   GrandTotal,
    //   Party,
    //   CreatedBy,
    //   UpdatedBy
    // })
    // debugger
    yield put(SpinnerState(false))
    yield put(getGRNListPageSuccess(response.Data))

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error get_GRN LIst API ",
    }));
  }
}

// List Page API
function* getGRNitem_Mode2_GenFunc({ data }) {
  // debugger
  const { jsonBody, pageMode, GRN_ADD, grnRef, challanNo } = data

  yield put(SpinnerState(true))
  try {
    const response = yield call(GRN_getItem_API, jsonBody);

    response["pageMode"] = pageMode;
    response.Data["GRNReferences"] = grnRef;
    response.Data["challanNo"] = challanNo;

    response["path"] = GRN_ADD; //Pagepath

    debugger
    yield put(SpinnerState(false))
    yield put(getGRN_itemMode2_Success(response))
    // response.Data.OrderItem.forEach(ele => {


    //   ele["inpRate"] = ele.Rate
    //   ele["inpQty"] = ele.Quantity
    //   ele["totalAmount"] = ele.Amount
    //   ele["UOM"] = ele.Unit
    //   ele["UOMLabel"] = ele.UnitName
    //   ele["inpBaseUnitQty"] = ele.BaseUnitQuantity


    // });
    // yield put(getGRN_itemMode3_Success(response.Data.OrderItem))


  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error get_GRN Item API ",
    }));
  }
}
function* GRNSaga() {

  yield takeEvery(GET_GRN_ITEM_MODE_2, getGRNitem_Mode2_GenFunc);
  yield takeEvery(POST_GRN_FROM_GRN_PAGE, postGRNGenFunc);
  yield takeEvery(EDIT_ORDER_FOR_ORDER_PAGE, editGRNGenFunc);
  yield takeEvery(UPDATE_GRN_ID_FROM_GRN_PAGE, UpdateGRNGenFunc)
  yield takeEvery(DELETE_GRN_FOR_GRN_PAGE, DeleteGRNGenFunc);
  yield takeEvery(GET_GRN_LIST_PAGE, get_GRN_GerFunc);
}

export default GRNSaga;
