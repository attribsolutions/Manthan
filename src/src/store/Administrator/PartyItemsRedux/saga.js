import { call, put, takeEvery } from "redux-saga/effects";
import { Party_Items, get_Party_Item_List, Items_Master_Get_API, GetPartyList_API, edit_PartyItem_List_Api, } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { PostPartyItemsSuccess, getPartyItemListSuccess, getPartyListSuccess, editModuleIDSuccess, editPartyItemIDSuccess, } from "./action";
import { POST_PARTYITEMS, GET_PARTY_ITEM_LIST, GET_PARTY_LIST, EDIT_PARTY_ITEM_ID, } from "./actionType";

// post api
function* Post_PartyItems_GneratorFunction({ data }) {


  try {
    const response = yield call(Party_Items, data);

    yield put(PostPartyItemsSuccess(response));
  } catch (error) {

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
    response.Data.map((item) => {
      item["itemCheck"] = false
      if (item.Party > 0) {
        { item["itemCheck"] = true }
      }
      return item

    });
    yield put(getPartyItemListSuccess(response.Data));
  } catch (error) {
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

function* editPartyItems_ID_GenratorFunction({ id, pageMode }) {
  debugger
  try {
    const response = yield call(edit_PartyItem_List_Api, id);

    response.pageMode = pageMode
    let Party = {};

    const PartyItem = response.Data.map((item) => {
      item["itemCheck"] = false
      if (item.Party > 0) {
        Party = item;
        item.itemCheck = true;
      }
      return item
    });
    response.Data = { ...Party, PartyItem };
    debugger
    yield put(editPartyItemIDSuccess(response));
  } catch (error) {
    // yield put(AlertState({
    //   Type: 4,
    //   Status: true, Message: "500 Error Message Edit Party Items",
    // }));
  }
}

function* PartyItemsSaga() {
  yield takeEvery(POST_PARTYITEMS, Post_PartyItems_GneratorFunction)
  yield takeEvery(GET_PARTY_ITEM_LIST, getPartyItemGenFunc)
  yield takeEvery(GET_PARTY_LIST, getPartyListGenFunc)
  yield takeEvery(EDIT_PARTY_ITEM_ID, editPartyItems_ID_GenratorFunction)


}

export default PartyItemsSaga;