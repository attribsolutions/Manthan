import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { PartyItemGoBtnAdd_API, ChannelItemGoBtnAdd_API, PartyItem_List_API, ChannelItem_List_API, PartyItem_Save_API, ChannelItem_Save_API, PartyItem_Edit_API, ChannelItem_Edit_API, } from "../../../helpers/backend_helper";
import { url } from "../../../routes";
import { savePartyItemsActionSuccess, goButtonPartyItemAddPageSuccess, getPartyItemAssingListSuccess, editPartyItemIDSuccess, PartyItemApiErrorAction, } from "./action";
import { SAVE_PARTY_ITEMS_ACTION, GO_BUTTON_PARTY_ITEM_ADD, GET_PARTY_ITEM_ASSING_LIST, EDIT_PARTY_ITEM_ID, } from "./actionType";


function* save_PartyItems_GenFunc({ config }) {
  const { subPageMode } = config;
  try {
    let response = null
 
    if (subPageMode === url.CHANNEL_ITEM) {
      response = yield call(ChannelItem_Save_API, config);
    }else{
      response = yield call(PartyItem_Save_API, config);
    }
    if (response) {
      yield put(savePartyItemsActionSuccess(response));
    }
  } catch (error) {
    CommonConsole(error)
    yield put(PartyItemApiErrorAction())
  }
}

// get Item list for Master Page
function* goButton_partyItem_Add_GenFunc(config) {
  const { jsonBody, subPageMode } = config;
  try {
    let response = null
    if (subPageMode === url.CHANNEL_ITEM_LIST) {
      response = yield call(PartyItemGoBtnAdd_API, jsonBody);
    } else {
      response = yield call(ChannelItemGoBtnAdd_API, jsonBody);
    }
    response.Data.map((item) => {
      item["selectCheck"] = false
      if (item.Party > 0) {
        { item["selectCheck"] = true }
      }
      return item
    });
    yield put(goButtonPartyItemAddPageSuccess(response.Data));


  } catch (error) {
    CommonConsole(error)
    yield put(PartyItemApiErrorAction())
  }
}


function* getPartyItemList_GenFunc({ config }) {
  debugger
  const { subPageMode } = config
  try {
    let response = null
    if (subPageMode === url.PARTYITEM_LIST) {
      response = yield call(PartyItem_List_API);
    }
    else if (subPageMode === url.CHANNEL_ITEM_LIST) {
      response = yield call(ChannelItem_List_API);
    }
    if (response) {
      yield put(getPartyItemAssingListSuccess(response.Data));
    } else {
      yield put(PartyItemApiErrorAction())
    }
  } catch (error) {
    CommonConsole(error)
    yield put(PartyItemApiErrorAction())
  }
}


function* editPartyItems_ID_GenFunc({ body }) {     // edit API 
  debugger
  const { config, jsonBody, subPageMode } = body;

  try {
    let response = null
    if (subPageMode === url.CHANNEL_ITEM_LIST) {
      response = yield call(ChannelItem_Edit_API, jsonBody);
    } else {
      response = yield call(PartyItem_Edit_API, jsonBody);
    }
    if (response) {
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
    }


  } catch (error) {
    CommonConsole(error)
    yield put(PartyItemApiErrorAction())
  }
}




function* PartyItemsSaga() {
  yield takeLatest(SAVE_PARTY_ITEMS_ACTION, save_PartyItems_GenFunc)
  yield takeLatest(GO_BUTTON_PARTY_ITEM_ADD, goButton_partyItem_Add_GenFunc)
  yield takeLatest(GET_PARTY_ITEM_ASSING_LIST, getPartyItemList_GenFunc)
  yield takeLatest(EDIT_PARTY_ITEM_ID, editPartyItems_ID_GenFunc)


}

export default PartyItemsSaga;