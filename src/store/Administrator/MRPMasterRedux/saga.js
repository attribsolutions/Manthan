import { call, put, takeEvery } from "redux-saga/effects";
import { GoButton_Post_API, Post_MRPMaster_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {postGoButtonDataSuccess, postMRPMasterDataSuccess} from "./action";
import { POST_GO_BUTTON_DATA, POST_MRP_MASTER_DATA } from "./actionTypes";


function* Post_MRPMaster_GenratorFunction({ Data }) {
  
    yield put(SpinnerState(true))
    try {
      const response = yield call(Post_MRPMaster_API, Data);
      yield put(SpinnerState(false))
      yield put(postMRPMasterDataSuccess(response));
      console.log("response",response)
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }
  
  function* GoButton_post_GenratorFunction({ data }) {
 
  
    yield put(SpinnerState(true))
    try {
      const response = yield call(GoButton_Post_API, data);
      yield put(SpinnerState(false))
      yield put(postGoButtonDataSuccess(response.Data));
      console.log("response",response)
    } catch (error) {
      yield put(SpinnerState(false))
      yield put(AlertState({ Type: 4, 
        Status: true, Message: "500 Error Message",
      }));
    }
  }

  function* MRPMasterSaga() {
    yield takeEvery(POST_MRP_MASTER_DATA, Post_MRPMaster_GenratorFunction);
    yield takeEvery(POST_GO_BUTTON_DATA, GoButton_post_GenratorFunction);

  }
  export default MRPMasterSaga;
