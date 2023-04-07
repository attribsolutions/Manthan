import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* save_Receipt_GenFunc({ config }) {   // Save API
  try {
    const response = yield call(apiCall.Receipt_Post_API, config);
    yield put(action.saveReceiptMaster(response));
  } catch (error) { CommonConsole(error) }
}

function* ReceiptGoButtonGenFunc({jsonBody}) {                                   // getList API
  try {
    const response = yield call(apiCall.Receipt_Go_Button_API,jsonBody);
    response.Data.map((index) => {
      return index["Calculate"] = ""
    });
    yield put(action.ReceiptGoButtonMaster_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// function* ReceiptModeGenFunc({jsonBody}) {                                   // getList API
//   try {
//     const response = yield call(apiCall.Receipt_Go_Button_API,jsonBody);
//     yield put(action.ReceiptModeAPI_Success(response.Data));
//   } catch (error) { CommonConsole(error) }
// }


function* ReceiptSaga() {
  yield takeEvery(actionType.SAVE_RECEIPT_MASTER, save_Receipt_GenFunc)
  yield takeEvery(actionType.RECEIPT_GO_BUTTON_MASTER, ReceiptGoButtonGenFunc)

}
export default ReceiptSaga;  