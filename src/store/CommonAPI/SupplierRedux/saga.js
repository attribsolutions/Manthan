import { call, put, takeEvery } from "redux-saga/effects";
import {
  getSupplierAddressSuccess,
  getSupplierSuccess,
} from "./actions";
import {
  GetSupplier_API,
  Party_Master_Edit_API,
} from "../../../helpers/backend_helper";

import {
  GET_SUPPLIER, GET_SUPPLIER_ADDRESS,
} from "./actionType";

import { AlertState } from "../../Utilites/CustomAlertRedux/actions";


function* getSupplierGenFunc() {
  debugger
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

function* supplierAddressGenFunc() {

  const USER = JSON.parse(localStorage.getItem("roleId"))
  try {
    const response = yield call(Party_Master_Edit_API, USER.Party_id
    );
    let first = [], secd = [], newArr = []
    const arr = response.Data.PartyAddress;
    arr.forEach((i, k) => {
      if (i.IsDefault === true) {

        first.push({
          value: i.id,
          label: i.Address,
        })
      } else {
        secd.push({
          value: i.id,
          label: i.Address,
        })
      }
    })
    newArr = [...first, ...secd]

    yield put(getSupplierAddressSuccess(newArr));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error for Party API ",
    }));
  }
}
function* SupplierSaga() {
  yield takeEvery(GET_SUPPLIER, getSupplierGenFunc);
  yield takeEvery(GET_SUPPLIER_ADDRESS, supplierAddressGenFunc);
}

export default SupplierSaga;
