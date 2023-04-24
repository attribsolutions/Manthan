import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { Save_Party_Items, get_Party_Item_List, GetPartyList_API, edit_PartyItem_List_Api, } from "../../../helpers/backend_helper";
import { SavePartyItemsSuccess, getPartyItemListSuccess, getPartyListSuccess, editPartyItemIDSuccess, } from "./action";
import { POST_PARTYITEMS, GET_PARTY_ITEM_LIST, GET_PARTY_LIST, EDIT_PARTY_ITEM_ID, } from "./actionType";


function* Save_PartyItems_GneratorFunction({ config }) {            // Save API
  try {
    const response = yield call(Save_Party_Items, config);
    yield put(SavePartyItemsSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* getPartyItemGenFunc({ SupplierID }) {                       // getList API
  try {
    const response = yield call(get_Party_Item_List, SupplierID);
    response.Data.map((item) => {
      item["selectCheck"] = false
      if (item.Party > 0) {
        { item["selectCheck"] = true }
      }
      return item
    });
    yield put(getPartyItemListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}



function* getPartyListGenFunc() {                                              // getList API
  try {
    const response = yield call(GetPartyList_API);
    yield put(getPartyListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* editPartyItems_ID_GenratorFunction({ config  }) {               // edit API 
  const { btnmode } = config;
  
  try {
    const response = yield call(edit_PartyItem_List_Api, config);
    response.pageMode = btnmode;

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
    yield put(editPartyItemIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}




function* PartyItemsSaga() {
  yield takeEvery(POST_PARTYITEMS, Save_PartyItems_GneratorFunction)
  yield takeEvery(GET_PARTY_ITEM_LIST, getPartyItemGenFunc)
  yield takeEvery(GET_PARTY_LIST, getPartyListGenFunc)
  yield takeEvery(EDIT_PARTY_ITEM_ID, editPartyItems_ID_GenratorFunction)


}

export default PartyItemsSaga;