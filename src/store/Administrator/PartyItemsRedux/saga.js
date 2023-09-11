import { call, put, takeLatest } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { PartyItemGoBtnAdd_API, ChannelItemGoBtnAdd_API, PartyItem_Save_API, ChannelItem_Save_API, ChannelItem_View_API } from "../../../helpers/backend_helper";
import { url } from "../../../routes";
import { savePartyItemsActionSuccess, goButtonPartyItemAddPageSuccess, editPartyItemIDSuccess, PartyItemApiErrorAction, channalItemViewDetailActionSuccess, } from "./action";
import { SAVE_PARTY_ITEMS_ACTION, GO_BUTTON_PARTY_ITEM_ADD, EDIT_PARTY_ITEM_ID, CHANNEL_ITEM_VIEW_DETAIL_ACTION, } from "./actionType";


function* save_PartyItems_GenFunc({ config }) {
  const { subPageMode } = config;
  try {
    let response = null

    if (subPageMode === url.CHANNEL_ITEM) {
      response = yield call(ChannelItem_Save_API, config);
    } else {
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

function* goButton_partyItem_Add_GenFunc({config}) {
  
  const { jsonBody, subPageMode } = config;
  try {
    let response = null
    if (subPageMode === url.CHANNEL_ITEM) {
      response = yield call(ChannelItemGoBtnAdd_API, jsonBody);
    } else {
      response = yield call(PartyItemGoBtnAdd_API, jsonBody);
    }
    response.Data.map((item) => {
      item["selectCheck"] = false;

      if (subPageMode === url.CHANNEL_ITEM) {
        if (item.PartyType > 0) {
          item["selectCheck"] = true;
        }
      }
      else if (item.Party > 0) {
        item["selectCheck"] = true;
      }
      return item
    });
    yield put(goButtonPartyItemAddPageSuccess(response.Data));


  } catch (error) {
    CommonConsole(error)
    yield put(PartyItemApiErrorAction())
  }
}





function* editPartyItems_ID_GenFunc({ body }) {     // edit API 
  
  const { config, jsonBody } = body;

  try {
    let  response = yield call(PartyItemGoBtnAdd_API, jsonBody);
    
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


function* viewChannelItem_GenFunc({ config }) {     // edit API 
  
 
  try {
    let  response = yield call(ChannelItem_View_API, config);
      yield put(channalItemViewDetailActionSuccess(response));
  } catch (error) {
    CommonConsole(error)
    yield put(PartyItemApiErrorAction())
  }
}



function* PartyItemsSaga() {
  yield takeLatest(SAVE_PARTY_ITEMS_ACTION, save_PartyItems_GenFunc)
  yield takeLatest(GO_BUTTON_PARTY_ITEM_ADD, goButton_partyItem_Add_GenFunc)
  yield takeLatest(EDIT_PARTY_ITEM_ID, editPartyItems_ID_GenFunc)
  yield takeLatest(CHANNEL_ITEM_VIEW_DETAIL_ACTION, viewChannelItem_GenFunc)
  

}

export default PartyItemsSaga;