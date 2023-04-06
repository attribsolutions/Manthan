import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";


// function* save_ManagementParties_GenFunc({ config }) {
//   try {
//     const response = yield call(apiCall.Management_Parties_Post_API, config);
//     yield put(action.saveManagementParties_Success(response));
//   } catch (error) { CommonConsole(error) }
// }

function* ReceiptGoButtonGenFunc({jsonBody}) {                                   // getList API
  try {
    const response = yield call(apiCall.Receipt_Go_Button_API,jsonBody);
    yield put(action.ReceiptGoButtonMaster_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* ReceiptSaga() {
  yield takeEvery(actionType.RECEIPT_GO_BUTTON_MASTER, ReceiptGoButtonGenFunc)
}
export default ReceiptSaga;  