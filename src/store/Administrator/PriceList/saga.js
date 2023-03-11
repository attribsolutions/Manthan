import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { delete_PriceList_API, get_PriceListByPartyType_API, Post_PriceList_API,edit_PriceList,update_PriceList, GetPriceList_For_Listpage } from "../../../helpers/backend_helper";
import { delete_PriceListSuccess, getPriceListDataSuccess, savePriceMasterActionSuccess,editPriceListSuccess,updatePriceListSuccess, getPriceListPageSuccess } from "./action";
import { DELETE_PRICE_LIST, GET_PRICE_LIST_DATA, POST_PRICE_LIST_DATA,EDIT_PRICE_LIST,UPDATE_PRICE_LIST,  GET_PRICE_LIST_PAGE } from "./actionType";


function* Post_PriceList_GenratorFunction({ Data }) {
    try {
      const response = yield call(Post_PriceList_API, Data);
      yield put(savePriceMasterActionSuccess(response));
    } catch (error) { CommonConsole(error) }
  }
  
function* get_PriceList_GenratorFunction({ partyType }) {
  try {
    const response = yield call(get_PriceListByPartyType_API, partyType);
    yield put(getPriceListDataSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}


//listpage
function* get_PriceListPage_GenratorFunction() {
  try {
    const response = yield call(GetPriceList_For_Listpage);
    yield put(getPriceListPageSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

//delete
function* delete_PriceList_GenFun({ id }) {
  try {
    const response = yield call(delete_PriceList_API, id);
    yield put(delete_PriceListSuccess(response));
  } catch (error) { CommonConsole(error) }
}



// edit api
function* Edit_PriceList__GenratorFunction({ id ,pageMode}) {
  try {
    const response = yield call(edit_PriceList, id);
    response.pageMode=pageMode
    yield put(editPriceListSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_PriceList_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_PriceList, updateData, ID);
    yield put(updatePriceListSuccess(response))
  } catch (error) { CommonConsole(error) }
}


  function* PriceListSaga() {
    yield takeEvery(POST_PRICE_LIST_DATA, Post_PriceList_GenratorFunction);
    yield takeEvery(GET_PRICE_LIST_DATA, get_PriceList_GenratorFunction);
    yield takeEvery(GET_PRICE_LIST_PAGE,    get_PriceListPage_GenratorFunction);                        
    yield takeEvery(DELETE_PRICE_LIST, delete_PriceList_GenFun);
    yield takeEvery(EDIT_PRICE_LIST, Edit_PriceList__GenratorFunction);
    yield takeEvery(UPDATE_PRICE_LIST, Update_PriceList_GenratorFunction);
  }
  export default PriceListSaga;
