import { call, put, takeEvery } from "redux-saga/effects";
import { Party_Items, GetSupplier_API, get_Item_List, get_Party_Item_List, Items_Master_Get_API, GetPartyList_API, } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { PostPartyItemsSuccess, getSupplierSuccess, getPartyItemListSuccess, getPartyListSuccess, } from "./action";
import { POST_PARTYITEMS, GET_SUPPLIER, GET_PARTY_ITEM_LIST, GET_PARTY_LIST, } from "./actionType";

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

function* getPartyItemGenFunc({ supplierId }) {


  //  Get ItemList
  try {
    const itemList = yield call(Items_Master_Get_API);
    const partyItem =  yield call(get_Party_Item_List, supplierId);
    const response = itemList.Data.map((item) => {
      item["itemCheck"] = false
      partyItem.Data.forEach((ele) => {
        if (item.id ===ele.Item) { item["itemCheck"] = true }
      });
      return item
    });
    yield put(getPartyItemListSuccess(response));
    // yield put(SpinnerState(false))
  } catch (error) {
    // yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// Get supplier

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

// Get Party List
function* getPartyListGenFunc() {
  // const USER = JSON.parse(localStorage.getItem("roleId"))
  try {
    const response = yield call(GetPartyList_API);
    yield put(getPartyListSuccess(response.Data));
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
  yield takeEvery(GET_PARTY_ITEM_LIST, getPartyItemGenFunc)
  yield takeEvery(GET_PARTY_LIST, getPartyListGenFunc)

}

export default PartyItemsSaga;