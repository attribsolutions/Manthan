import { call, put, takeEvery } from "redux-saga/effects";
import {
  CredietDebitTypeSuccess,
  EditCreditlistSuccess,
  GetCreditListSuccess,
  Invoice_Return_ID_Success,
  deleteCreditlistSuccess,
  editCreditIDSuccess,
  saveCredit_Success,
  updateCreditIDSuccess
} from "./action";
import {
  Credit_Debit_Save_API,
  Credit_Debit_Type,
  Edit_Credit_List_API,
  Go_Button_Credit_Debit_Post_API,
  InvoiceReturn_API,
  Invoice_No_list_API,
  del_Credit_List_API,
  edit_Credit_List_Api,
  update_Credit_List_Api
} from "../../../helpers/backend_helper";
import {
  CREDITDEBIT_TYPE,
  DELETE_CREDIT_LIST_ID,
  EDIT_CREDIT_ID,
  EDIT_CREDIT_LIST_ID,
  GET_CREDIT_LIST,
  INVOICE_RETURN_ID,
  SAVE_CREDIT,
  UPDATE_CREDIT_ID
} from "./actionType";
import { CommonConsole, convertDatefunc, convertTimefunc } from "../../../components/Common/CommonFunction";


function* Save_Method_ForCredit_GenFun({ config }) {   // Save API
  try {

    const response = yield call(Credit_Debit_Save_API, config);
    yield put(saveCredit_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* Get_Credit_List_GenFunc(data) {                                // getList API
  try {
    debugger
    const response = yield call(Go_Button_Credit_Debit_Post_API, data.data);
    const newList = yield response.Data.map((i) => {
      debugger
      var date = convertDatefunc(i.CRDRNoteDate)
      var time = convertTimefunc(i.CreatedOn)
      i.CRDRNoteDate = (`${date} ${time}`)
      return i
  })
    yield put(GetCreditListSuccess(newList));
  } catch (error) { CommonConsole(error) }
}

function* Delete_Credit_ID_GenFunc({ config }) {                   // delete API
  try {
    debugger
    const response = yield call(del_Credit_List_API, config);
    yield put(deleteCreditlistSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* CreditDeitType_ID_GenFunc(data) {                     // edit API 

  try {
    const response = yield call(Credit_Debit_Type, data.data);
    yield put(CredietDebitTypeSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}



// function* Update_Grouplist_ID_GenFunc({ config }) {                    // update API
//   try {
//     const response = yield call(update_Group_List_Api, config);
//     yield put(updateGroupIDSuccess(response))
//   } catch (error) { CommonConsole(error) }
// }

function* Edit_Creditlist_ID_GenFunc({ config }) {         //edit  Api              
  const { btnmode } = config;
  try {
    const response = yield call(Edit_Credit_List_API, config);
    response.pageMode = btnmode;
    yield put(EditCreditlistSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* InvoiceReturn_ID_GenFunc(id) {           // Invoice Return Api
  debugger                
  try {
    debugger
    const response = yield call(InvoiceReturn_API, id.id);
    yield put(Invoice_Return_ID_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* CreditDebitSaga() {
  yield takeEvery(SAVE_CREDIT, Save_Method_ForCredit_GenFun)
  yield takeEvery(GET_CREDIT_LIST, Get_Credit_List_GenFunc)
  yield takeEvery(DELETE_CREDIT_LIST_ID, Delete_Credit_ID_GenFunc)
  yield takeEvery(CREDITDEBIT_TYPE, CreditDeitType_ID_GenFunc)
  yield takeEvery(EDIT_CREDIT_LIST_ID,Edit_Creditlist_ID_GenFunc)
  yield takeEvery(INVOICE_RETURN_ID,InvoiceReturn_ID_GenFunc)



 

  // yield takeEvery(UPDATE_GROUPMASTER_ID, Update_Grouplist_ID_GenFunc)
}

export default CreditDebitSaga;