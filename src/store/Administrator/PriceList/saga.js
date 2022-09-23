import { call, put, takeEvery } from "redux-saga/effects";
import { delete_PriceList_API, get_PriceListByPartyType_API, Post_PriceList_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { delete_PriceListSuccess, getPriceListDataSuccess, postPriceListDataSuccess } from "./action";
import { DELETE_PRICE_LIST, GET_PRICE_LIST_DATA, POST_PRICE_LIST_DATA } from "./actionType";


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

  function* PriceListSaga() {
    yield takeEvery(POST_PRICE_LIST_DATA, Post_PriceList_GenratorFunction);
    yield takeEvery(GET_PRICE_LIST_DATA, get_PriceList_GenratorFunction);
    yield takeEvery(DELETE_PRICE_LIST, delete_PriceList_GenFun);
  }
  export default PriceListSaga;
