import { call, put, takeEvery } from "redux-saga/effects";
import { Post_MarginMaster_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {delete_MarginListSuccess, 
        editMarginListSuccess,
        getMarginListPageSuccess,
        postMarginMasterDataSuccess,
         updateMarginListSuccess,
} from "./action";
import { DELETE_MARGIN_LIST_PAGE,
       EDIT_MARGIN_LIST_PAGE,
       GET_MARGIN_LIST_PAGE,
       POST_MARGIN_MASTER_DATA,
        UPDATE_MARGIN_LIST_PAGE 
      
       } from "./actionType";


function* Post_MarginMaster_GenratorFunction({ Data }) {
  
    yield put(SpinnerState(true))
    try {
      const response = yield call(Post_MarginMaster_API, Data);
      yield put(SpinnerState(false))
      yield put(postMarginMasterDataSuccess(response));
      console.log("response",response)
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }


//listpage
function* get_MarginListPage_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(GetMarginList_For_Listpage);
    yield put(SpinnerState(false))
    yield put(getMarginListPageSuccess(response.Data));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

//delete
function* delete_MarginListPage_GenratorFunction({ id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(delete_MarginList_API, id);
    yield put(SpinnerState(false))
    yield put(delete_MarginListSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}



// edit api
function* Edit_MarginListPage_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_MarginList, id);
    response.pageMode = pageMode
    yield put(editMarginListSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_MarginListPage_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_MarginList, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateMarginListSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}



  
  function* MarginMasterSaga() {
    yield takeEvery(POST_MARGIN_MASTER_DATA, Post_MarginMaster_GenratorFunction);
    yield takeEvery(GET_MARGIN_LIST_PAGE,   get_MarginListPage_GenratorFunction);
    yield takeEvery(DELETE_MARGIN_LIST_PAGE, delete_MarginListPage_GenratorFunction);
    yield takeEvery(EDIT_MARGIN_LIST_PAGE, Edit_MarginListPage_GenratorFunction);
    yield takeEvery(UPDATE_MARGIN_LIST_PAGE, Update_MarginListPage_GenratorFunction);
  }
  export default MarginMasterSaga;
