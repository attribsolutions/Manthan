import { call, put, takeEvery } from "redux-saga/effects";
import { Party_Items, get_Party_Item_List, Items_Master_Get_API, GetPartyList_API, } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { PostPartyItemsSuccess, getPartyItemListSuccess, getPartyListSuccess, } from "./action";
import { POST_PARTYITEMS, GET_PARTY_ITEM_LIST, GET_PARTY_LIST, } from "./actionType";

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
  debugger
  try {
    // const itemList = yield call(Items_Master_Get_API);
    const response = yield call(get_Party_Item_List, supplierId);
    const response1 = response.Data.map((item) => {
      item["itemCheck"] = false
      if (item.Party > 0) {
        { item["itemCheck"] = true }
      }
      // partyItem.Data.forEach((ele) => {
      //   if (item.id === ele.Item) { item["itemCheck"] = true }
      // });
      return item
     
    });
    yield put(getPartyItemListSuccess(response1));
    // yield put(SpinnerState(false))
  } catch (error) {
    // yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message Party Item List",
    }));
  }
}

// Get Party List
function* getPartyListGenFunc() {
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
  yield takeEvery(GET_PARTY_ITEM_LIST, getPartyItemGenFunc)
  yield takeEvery(GET_PARTY_LIST, getPartyListGenFunc)

}

export default PartyItemsSaga;