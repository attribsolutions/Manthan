import { Filter } from "interweave";
import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";
import { Save_Party_Items, get_Party_Item_List, GetPartyList_API, edit_PartyItem_List_Api, } from "../../../helpers/backend_helper";
import { SavePartyItemsSuccess, getPartyItemListSuccess, getPartyListSuccess, editPartyItemIDSuccess, } from "./action";
import { POST_PARTYITEMS, GET_PARTY_ITEM_LIST, GET_PARTY_LIST, EDIT_PARTY_ITEM_ID, } from "./actionType";


function* Save_PartyItems_GneratorFunction({ config }) {            // Save API
  try {
    const response = yield call(Save_Party_Items, config);
    yield put(SavePartyItemsSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// get Item list for Master Page
function* getPartyItemGenFunc({ jsonBody }) {                       // getList API
  try {
    const response = yield call(get_Party_Item_List, jsonBody);
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


function* getPartyListGenFunc() {
  // const filter = loginJsonBody()                                         // getList API
  try {
    const response = yield call(GetPartyList_API);
    yield put(getPartyListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* editPartyItems_ID_GenratorFunction({ body }) {     // edit API 
 
  const { config, jsonBody } = body;
  try {
    const response = yield call(edit_PartyItem_List_Api, jsonBody);
    response.pageMode = config.btnmode;

    const PartyItem = response.Data.map((item) => {
      item["itemCheck"] = false
      if (item.Party > 0) {
        item.itemCheck = true;
      }
      return item
    });
    response.Data = { ...config, PartyItem };

    yield put(editPartyItemIDSuccess(response));
  } catch (error) { CommonConsole(error) }
}




function* PartyItemsSaga() {
  yield takeLatest(POST_PARTYITEMS, Save_PartyItems_GneratorFunction)
  yield takeLatest(GET_PARTY_ITEM_LIST, getPartyItemGenFunc)
  yield takeLatest(GET_PARTY_LIST, getPartyListGenFunc)
  yield takeLatest(EDIT_PARTY_ITEM_ID, editPartyItems_ID_GenratorFunction)


}

export default PartyItemsSaga;