import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { CommonConsole, convertDatefunc, convertTimefunc, loginCompanyID, loginJsonBody, loginPartyID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";

// customer dropdown click then table values display
function* ReceiptGoButtonGenFunc({ jsonBody }) {

  try {
    const response = yield call(apiCall.Receipt_Go_Button_API, jsonBody);
    response.Data.map((index) => {
      return index["Calculate"] = 0
    });
    yield put(action.ReceiptGoButtonMaster_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// OpeningBalance value
function* OpeningBalanceGenFunc({ jsonBody }) {

  try {
    const response = yield call(apiCall.Opening_balance_API, jsonBody);
    yield put(action.GetOpeningBalance_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Dropdown API
function* Depositor_Bank_GenFunc({ jsonBody }) {
  const filters = loginJsonBody()
  try {
    const response = yield call(apiCall.Depositor_Bank_Filter_API, filters);
    yield put(action.DepositorBankFilter_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Receipt List API
function* Receipt_List_GenFun({ jsonBody ,subPageMode}) {
  debugger
  let response;
  try { 
    if (subPageMode===url.PAYMENT_ENTRY_LIST) {
      response = yield call(apiCall.Receipt_Filter_API, jsonBody);
    }
    else if (subPageMode===url.RECEIPTS_LIST_2) {
      response = yield call(apiCall.Make_Receipt_to_Payment_API, jsonBody);
    }
    else if (subPageMode===url.RECEIPTS_LIST) {
      response = yield call(apiCall.Receipt_Filter_API, jsonBody);
    }
    // const response = yield call(apiCall.Receipt_Filter_API, jsonBody);
    // const newList = yield response.Data.map((i) => {
    //   var date = convertDatefunc(i.ReceiptDate)
    //   i.Date = (date)
    // })
    yield put(action.ReceiptListAPISuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// Post API 
function* save_Receipt_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Receipt_Post_API, config);
    yield put(action.saveReceiptMaster_Success(response));

  } catch (error) { CommonConsole(error) }
}

// Receipt Type API
function* Receipt_Type_GenFunc({ jsonBody }) {

  try {
    const response = yield call(apiCall.Receipt_Type_API, jsonBody);
    yield put(action.ReceiptTypeAPISuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Delete_Receipt_ID_GenFunc({ config }) {          // delete API
  try {
    const response = yield call(apiCall.Receipt_Delete_API, config);
    yield put(action.deleteReceiptList_Success(response))
  } catch (error) { CommonConsole(error) }
}

// Dropdown API
function* Bank_List_GenFunc() {
  const jsonBody = {"PartyID":loginPartyID(),"CompanyID":loginCompanyID()}
  try {
    const response = yield call(apiCall.Bank_List_API, jsonBody);
    yield put(action.BankListAPISuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* ReceiptSaga() {
  yield takeEvery(actionType.RECEIPT_GO_BUTTON_MASTER, ReceiptGoButtonGenFunc)
  yield takeEvery(actionType.GET_OPENING_BALANCE, OpeningBalanceGenFunc)
  yield takeEvery(actionType.DEPOSITOR_BANK_FILTER, Depositor_Bank_GenFunc)
  yield takeEvery(actionType.RECEIPT_LIST_API, Receipt_List_GenFun)
  yield takeEvery(actionType.SAVE_RECEIPT_MASTER, save_Receipt_GenFunc)
  yield takeEvery(actionType.RECEIPT_TYPE_API, Receipt_Type_GenFunc)
  yield takeEvery(actionType.DELETE_RECEIPT_LIST, Delete_Receipt_ID_GenFunc)
  yield takeEvery(actionType.BANK_LIST_API, Bank_List_GenFunc)

}
export default ReceiptSaga;  