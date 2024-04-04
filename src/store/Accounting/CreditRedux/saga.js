import { call, put, takeLatest } from "redux-saga/effects";
import {
  CredietDebitTypeSuccess,
  EditCreditlistSuccess,
  GetCreditListSuccess,
  Invoice_Return_ID_Success,
  deleteCreditlistSuccess,
  saveCredit_Success,
  Receipt_No_List_Success,
  CreditDebitApiErrorAction,
  Uploaded_Credit_Debit_EInvoiceSuccess,
  Cancel_Credit_Debit_EInvoiceSuccess,
  bulk_CreditNote_delete_ID_Success,
} from "./action";
import {
  Credit_Debit_Save_API,
  GenralMasterSubType,
  Edit_Credit_List_API,
  Go_Button_Credit_Debit_Post_API,
  InvoiceReturn_API,
  del_Credit_List_API,
  Receipt_Number_API,
  EInvoice_Credit_Debit_Uploade_Get_API,
  EInvoice_Credit_Debit_Cancel_Get_API,
  BulkCreditNote_delete_API,
} from "../../../helpers/backend_helper";
import {
  BULK_CREDITNOTE_DELETE_ID,
  CANCLE_CREDIT_DEBIT_E_INVOICE_ACTION,
  CREDITDEBIT_TYPE,
  DELETE_CREDIT_LIST_ID,
  EDIT_CREDIT_LIST_ID,
  GET_CREDIT_LIST,
  INVOICE_RETURN_ID,
  RECEIPT_NUMBER_LIST,
  SAVE_CREDIT,
  UPLOADED_CREDIT_DEBIT_E_INVOICE_ACTION,
} from "./actionType";

import { date_dmy_func, convertTimefunc, amountCommaSeparateFunc, loginUserID } from "../../../components/Common/CommonFunction";

function* Save_Method_ForCredit_GenFun({ config }) {   // Save API
  try {

    const response = yield call(Credit_Debit_Save_API, config);
    yield put(saveCredit_Success(response));
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* Get_Credit_List_GenFunc(data) {               // getList API
  try {

    const response = yield call(Go_Button_Credit_Debit_Post_API, data.data);
    const newList = yield response.Data.map((i) => {

      if (!(i.ImportFromExcel)) {
        i.forceSelectDissabled = true;//select row check box dessible 
      }

      i["recordsAmountTotal"] = i.GrandTotal;  // Breadcrumb Count total
      i["InvoiceUploads"] = i.CRDRNoteUploads  // Added this blank Array to Show e Invoive Array   Further devlopment Remain 
      i["PageMode"] = "CreditDebitList"  //Mode Added  for e invoice  column condition check in list Action button in einvoice
      i.GrandTotal = amountCommaSeparateFunc(parseFloat(i.GrandTotal).toFixed(2)) //  GrandTotal show with commas
      var date = date_dmy_func(i.CRDRNoteDate)
      var time = convertTimefunc(i.CreatedOn)
      i.CRDRNoteDate = (`${date} ${time}`)
      return i
    })
    yield put(GetCreditListSuccess(newList));
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* Delete_Credit_ID_GenFunc({ config }) {         // delete API
  try {

    const response = yield call(del_Credit_List_API, config);
    yield put(deleteCreditlistSuccess(response))
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* BulkCreditNote_Delete_ID_GenFunc({ config }) {         // delete API

  try {
    const response = yield call(BulkCreditNote_delete_API, config);
    yield put(bulk_CreditNote_delete_ID_Success(response))
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* CreditDeitType_ID_GenFunc(data) {                // edit API 

  try {
    const response = yield call(GenralMasterSubType, data.data);
    yield put(CredietDebitTypeSuccess(response.Data));
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* Edit_Creditlist_ID_GenFunc({ config }) {
  //edit  Api              
  const { btnmode } = config;
  try {
    const response = yield call(Edit_Credit_List_API, config);
    response.pageMode = btnmode;
    yield put(EditCreditlistSuccess(response));
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* InvoiceReturn_ID_GenFunc(id) {           // Invoice Return Api

  try {
    const response = yield call(InvoiceReturn_API, id.id);
    yield put(Invoice_Return_ID_Success(response.Data));
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}


//**************************** E-Invoice (upload ,cancel,) ***************************************/

function* Uploade_Credit_Debit_EInvoiceGenFunc({ config }) {

  config["UserID"] = loginUserID();
  try {

    const response = yield call(EInvoice_Credit_Debit_Uploade_Get_API, config)
    yield put(Uploaded_Credit_Debit_EInvoiceSuccess(response));
  } catch (error) {
    yield put(CreditDebitApiErrorAction())
  }
}

function* Cancle_Credit_Debit_EInvoiceGenFunc({ config }) {
  config["UserID"] = loginUserID();
  try {
    const response = yield call(EInvoice_Credit_Debit_Cancel_Get_API, config)
    yield put(Cancel_Credit_Debit_EInvoiceSuccess(response));
  } catch (error) {
    yield put(CreditDebitApiErrorAction())
  }
}

// Receipt No. dropdown Api for debit master page.
function* Receipt_Number_GenFunc({ jsonBody }) {                // edit API 

  try {
    const response = yield call(Receipt_Number_API, jsonBody);
    yield put(Receipt_No_List_Success(response.Data));
  } catch (error) { yield put(CreditDebitApiErrorAction()) }
}

function* CreditDebitSaga() {
  yield takeLatest(SAVE_CREDIT, Save_Method_ForCredit_GenFun)
  yield takeLatest(GET_CREDIT_LIST, Get_Credit_List_GenFunc)
  yield takeLatest(DELETE_CREDIT_LIST_ID, Delete_Credit_ID_GenFunc)
  yield takeLatest(BULK_CREDITNOTE_DELETE_ID, BulkCreditNote_Delete_ID_GenFunc)
  yield takeLatest(CREDITDEBIT_TYPE, CreditDeitType_ID_GenFunc)
  yield takeLatest(EDIT_CREDIT_LIST_ID, Edit_Creditlist_ID_GenFunc)
  yield takeLatest(INVOICE_RETURN_ID, InvoiceReturn_ID_GenFunc)
  yield takeLatest(RECEIPT_NUMBER_LIST, Receipt_Number_GenFunc)

  yield takeLatest(UPLOADED_CREDIT_DEBIT_E_INVOICE_ACTION, Uploade_Credit_Debit_EInvoiceGenFunc)
  yield takeLatest(CANCLE_CREDIT_DEBIT_E_INVOICE_ACTION, Cancle_Credit_Debit_EInvoiceGenFunc)



}

export default CreditDebitSaga;