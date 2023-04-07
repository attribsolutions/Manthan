import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole, loginJsonBody } from "../../../components/Common/CommonFunction";


function* ReceiptGoButtonGenFunc({ jsonBody }) {                                   // getList API
  try {
    const response = yield call(apiCall.Receipt_Go_Button_API, jsonBody);
    response.Data.map((index) => {
      return index["Calculate"] = ""
    });
    yield put(action.ReceiptGoButtonMaster_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Depositor_Bank_GenFunc({ jsonBody }) {
  const filters = loginJsonBody()
  try {
    const response = yield call(apiCall.Depositor_Bank_Filter_API, filters);
    yield put(action.DepositorBankFilter_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* save_Receipt_GenFunc({ config }) { 
  debugger  // Save API
  try {
    const response = yield call(apiCall.Receipt_Post_API, config);
    yield put(action.saveReceiptMaster_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* ReceiptSaga() {
  yield takeEvery(actionType.RECEIPT_GO_BUTTON_MASTER, ReceiptGoButtonGenFunc)
  yield takeEvery(actionType.DEPOSITOR_BANK_FILTER, Depositor_Bank_GenFunc)
  yield takeEvery(actionType.SAVE_RECEIPT_MASTER, save_Receipt_GenFunc)
}
export default ReceiptSaga;  