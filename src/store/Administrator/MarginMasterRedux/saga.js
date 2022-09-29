import { call, put, takeEvery } from "redux-saga/effects";
import { Post_MarginMaster_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {postMarginMasterDataSuccess} from "./action";
import { POST_MARGIN_MASTER_DATA } from "./actionType";


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
  
  function* MarginMasterSaga() {
    yield takeEvery(POST_MARGIN_MASTER_DATA, Post_MarginMaster_GenratorFunction);
  }
  export default MarginMasterSaga;
