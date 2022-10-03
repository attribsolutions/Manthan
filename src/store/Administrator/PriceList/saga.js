import { call, put, takeEvery } from "redux-saga/effects";
import { delete_PriceList_API, get_PriceListByPartyType_API, Post_PriceList_API,edit_PriceList,update_PriceList, GetPriceList_For_Listpage } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { getPriceListSuccess } from "../PartyRedux/action";
import { delete_PriceListSuccess, getPriceListDataSuccess, postPriceListDataSuccess,editPriceListSuccess,updatePriceListSuccess, getPriceListPageSuccess } from "./action";
import { DELETE_PRICE_LIST, GET_PRICE_LIST_DATA, POST_PRICE_LIST_DATA,EDIT_PRICE_LIST,UPDATE_PRICE_LIST, GET_PRICE_LIST, GET_PRICE_LIST_PAGE } from "./actionType";


function* Post_PriceList_GenratorFunction({ Data }) {
  debugger
    yield put(SpinnerState(true))
    try {
      const response = yield call(Post_PriceList_API, Data);
      yield put(SpinnerState(false))
      yield put(postPriceListDataSuccess(response));
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
function* get_PriceList_GenratorFunction({ partyType }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(get_PriceListByPartyType_API, partyType);
    yield put(SpinnerState(false))
    yield put(getPriceListDataSuccess(response.Data));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}


//listpage
function* get_PriceListPage_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(GetPriceList_For_Listpage);
    yield put(SpinnerState(false))
    yield put(getPriceListPageSuccess(response.Data));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}

//delete
function* delete_PriceList_GenFun({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(delete_PriceList_API, id);
    yield put(SpinnerState(false))
    yield put(delete_PriceListSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}



// edit api
function* Edit_PriceList__GenratorFunction({ id ,pageMode}) {
  try {
    const response = yield call(edit_PriceList, id);
    response.pageMode=pageMode
    yield put(editPriceListSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_PriceList_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_PriceList, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updatePriceListSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
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
