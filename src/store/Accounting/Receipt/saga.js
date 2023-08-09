import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { amountCommaSeparateFunc, concatDateAndTime, date_dmy_func, loginCompanyID, loginPartyID } from "../../../components/Common/CommonFunction";
import * as url from "../../../routes/route_url";

// customer dropdown click then table values display
function* ReceiptGoButtonGenFunc({ config }) {

  const { ListData, path, pageMode } = config
  try {

    const response = yield call(apiCall.Receipt_Go_Button_API, config);
    response["pageMode"] = pageMode;
    response["ListData"] = ListData;
    response["path"] = path;
    response.Data.map((i) => {

      //tranzaction date is only for fiterand page field but UI show transactionDateLabel
      i["transactionDate"] = i.CreatedOn;
      i["transactionDateLabel"] = concatDateAndTime(i.InvoiceDate, i.CreatedOn);

      i["Calculate"] = 0
      return i
    });

    yield put(action.ReceiptGoButtonMaster_Success(response));
  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

// OpeningBalance value
function* OpeningBalanceGenFunc({ jsonBody }) {

  try {
    const response = yield call(apiCall.Opening_balance_API, jsonBody);
    yield put(action.GetOpeningBalance_Success(response.Data));
  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

// Receipt List API
function* Receipt_List_GenFun({ jsonBody, subPageMode }) {

  let response;
  try {
    if ((subPageMode === url.PAYMENT_ENTRY_LIST) || subPageMode === url.RECEIPTS_LIST) {
      response = yield call(apiCall.Receipt_Filter_API, jsonBody);
    }
    else if (subPageMode === url.RECEIPTS_LIST_2) {
      response = yield call(apiCall.Make_Receipt_to_Payment_API, jsonBody);
    }

    const newList = yield response.Data.map((i) => {
      i.AmountPaid = amountCommaSeparateFunc(i.AmountPaid) //  AmountPaid show with commas

      //tranzaction date is only for fiterand page field but UI show transactionDateLabel
      i.dashboardReceiptDate = date_dmy_func(i.ReceiptDate);
      i["ChequeDate"] = i.ReceiptModeName === "Cash" ? "" : date_dmy_func(i.ChequeDate)
      i["transactionDate"] = i.CreatedOn;
      i["transactionDateLabel"] = concatDateAndTime(i.ReceiptDate, i.CreatedOn);

      return i
    })

    yield put(action.ReceiptListAPISuccess(newList));
  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

// Post API 
function* save_Receipt_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Receipt_Post_API, config);
    yield put(action.saveReceiptMaster_Success(response));

  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

// Receipt Type API
function* Receipt_Type_GenFunc({ jsonBody }) {

  try {
    const response = yield call(apiCall.GenralMasterSubType, jsonBody);
    yield put(action.ReceiptTypeAPISuccess(response.Data));
  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

// delete API
function* Delete_Receipt_ID_GenFunc({ config }) {

  try {
    const response = yield call(apiCall.Receipt_Delete_API, config);
    yield put(action.deleteReceiptList_Success(response))
  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

// Bank list Dropdown API
function* Bank_List_GenFunc() {
  const jsonBody = { "PartyID": loginPartyID(), "CompanyID": loginCompanyID() }
  try {
    const response = yield call(apiCall.Bank_List_API, jsonBody);
    yield put(action.BankListAPISuccess(response.Data));
  } catch (error) { yield put(action.ReceiptAndPaymentApiErrorAction()) }
}

function* ReceiptSaga() {
  yield takeLatest(actionType.RECEIPT_GO_BUTTON_MASTER, ReceiptGoButtonGenFunc)
  yield takeLatest(actionType.GET_OPENING_BALANCE, OpeningBalanceGenFunc)
  yield takeLatest(actionType.RECEIPT_LIST_API, Receipt_List_GenFun)
  yield takeLatest(actionType.SAVE_RECEIPT_MASTER, save_Receipt_GenFunc)
  yield takeLatest(actionType.RECEIPT_TYPE_API, Receipt_Type_GenFunc)
  yield takeLatest(actionType.DELETE_RECEIPT_LIST, Delete_Receipt_ID_GenFunc)
  yield takeLatest(actionType.BANK_LIST_API, Bank_List_GenFunc)

}
export default ReceiptSaga;  