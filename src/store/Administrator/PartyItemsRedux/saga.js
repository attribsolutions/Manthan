import { call, put, takeEvery } from "redux-saga/effects";
import { Party_Items,GetSupplier_API, GoButton_API, } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {  PostPartyItemsSuccess, goButtonSuccess, getSupplierSuccess,} from "./action";
import {  POST_PARTYITEMS, GET_SUPPLIER,  GO_BUTTON_FOR_PARTYITEMS_PAGE, } from "./actionType";

// post api
function* Post_PartyItems_GneratorFunction({ data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Party_Items, data);
    yield put(SpinnerState(false))
    yield put(PostPartyItemsSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* goButtonGenFunc({ data }) {
    yield put(SpinnerState(true))
    try {
      const response = yield call(GoButton_API, data);
      yield put(goButtonSuccess(response.Data));
      yield put(SpinnerState(false))
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Message",
      }));
    }
  }

  function* getSupplierGenFunc() {

    const USER = JSON.parse(localStorage.getItem("roleId"))
    try {
      const response = yield call(GetSupplier_API, USER.Party_id
      );
      yield put(getSupplierSuccess(response.Data));
    } catch (error) {
      yield put(AlertState({
        Type: 4,
        Status: true, Message: "500 Error Message for getSupplier ",
      }));
    }
  }

function* PartyItemsSaga() {
    yield takeEvery(POST_PARTYITEMS, Post_PartyItems_GneratorFunction)
    yield takeEvery(GET_SUPPLIER, getSupplierGenFunc)
    yield takeEvery(GO_BUTTON_FOR_PARTYITEMS_PAGE, goButtonGenFunc)
  }
  
  export default PartyItemsSaga;