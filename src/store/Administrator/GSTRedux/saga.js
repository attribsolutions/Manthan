import { call, put, takeEvery } from "redux-saga/effects";
import { GSTList_Delete_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import { deleteGSTForMasterPageSuccess } from "./action";
import { DELETE_GST_FOR_MASTER_PAGE } from "./actionType";

function* deleteGST_ID({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(GSTList_Delete_API, id);
    response["deletedId"] = id
    yield put(deleteGSTForMasterPageSuccess(response))
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 4, 
      Status: true, Message: "500 Error Message",
    }));
  }
}



function* GSTSaga() {
   yield takeEvery(DELETE_GST_FOR_MASTER_PAGE, deleteGST_ID);
}

export default GSTSaga;
