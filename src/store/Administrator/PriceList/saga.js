import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole, loginCompanyID } from "../../../components/Common/CommonFunction";
import {
  delete_PriceList_API,
  get_PriceListByPartyType_API,
  Save_PriceList_API,
  edit_PriceList,
  update_PriceList,
  get_PriceListByCompay_API
} from "../../../helpers/backend_helper";
import {
  delete_PriceListSuccess,
  priceListByPartyActionSuccess,
  savePriceMasterActionSuccess,
  editPriceListSuccess,
  updatePriceListSuccess,
  priceListByCompay_ActionSuccess
} from "./action";
import {
  DELETE_PRICE_LIST,
  PRICE_LIST_BY_PARTY_ACTION,
  POST_PRICE_LIST_DATA,
  EDIT_PRICE_LIST,
  UPDATE_PRICE_LIST,
  PRICE_LIST_BY_COMPANY
} from "./actionType";

function* PriceList_ByParty_GenFunc({ partyType }) {
  try {
    const response = yield call(get_PriceListByPartyType_API, partyType);
    yield put(priceListByPartyActionSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}


function* Save_PriceList_GenFunc({ config }) {
  try {
    const response = yield call(Save_PriceList_API, config);
    yield put(savePriceMasterActionSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* get_PriceListPageByCompany_GenFunc() {//listpage
  try {
    const response = yield call(get_PriceListByCompay_API, loginCompanyID());
    yield put(priceListByCompay_ActionSuccess(response.Data))
  } catch (error) { CommonConsole(error) }
}


function* delete_PriceList_GenFun({ config = {} }) {//delete
  try {
    const response = yield call(delete_PriceList_API, config);
    yield put(delete_PriceListSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* Edit_PriceList__GenFunc({ config }) {// edit api

  const { btnmode, PartyTypeName, PartyTypeId } = config;
  try {
    const response = yield call(edit_PriceList, config);
    response.pageMode = btnmode
    response.Data["PartyTypeName"] = PartyTypeName
    response.Data["PartyTypeId"] = PartyTypeId
    yield put(editPriceListSuccess(response));
  } catch (error) { CommonConsole(error) }
}


function* Update_PriceList_GenFunc({ config = {} }) {// update api
  try {
    const response = yield call(update_PriceList, config);
    yield put(updatePriceListSuccess(response))
  } catch (error) { CommonConsole(error) }
}



function* PriceListSaga() {
  yield takeEvery(POST_PRICE_LIST_DATA, Save_PriceList_GenFunc);
  yield takeEvery(PRICE_LIST_BY_PARTY_ACTION, PriceList_ByParty_GenFunc);
  yield takeEvery(DELETE_PRICE_LIST, delete_PriceList_GenFun);
  yield takeEvery(EDIT_PRICE_LIST, Edit_PriceList__GenFunc);
  yield takeEvery(UPDATE_PRICE_LIST, Update_PriceList_GenFunc);
  yield takeEvery(PRICE_LIST_BY_COMPANY, get_PriceListPageByCompany_GenFunc);
}
export default PriceListSaga;
