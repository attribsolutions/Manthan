import { call, put, takeEvery } from "redux-saga/effects";
import {
  CredietDebitTypeSuccess,
  GetCreditListSuccess,
  deleteGrouplistSuccess,
  editGroupIDSuccess,
  getGroupListSuccess,
  saveCredit_Success,
  saveGroupMaster_Success,
  updateGroupIDSuccess
} from "./action";
import {
  Credit_Debit_Save_API,
  Credit_Debit_Type,
  Go_Button_Credit_Debit_Post_API,
  del_Group_List_API,
  edit_Group_List_Api,
  get_Group_List_Api,
  save_Group_API,
  update_Group_List_Api
} from "../../../helpers/backend_helper";
import {
  CREDITDEBIT_TYPE,
  DELETE_CREDIT_LIST_ID,
  EDIT_GROUPMASTER_ID,
  GET_CREDIT_LIST,
  SAVE_CREDIT,
  UPDATE_GROUPMASTER_ID
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* Save_Method_ForCredit_GenFun({ config }) {   // Save API
  try {

    const response = yield call(Credit_Debit_Save_API, config);
    yield put(saveCredit_Success(response));
  } catch (error) { CommonConsole(error) }
}

function* Get_Credit_List_GenFunc(data) {                                // getList API
  try {
    const response = yield call(Go_Button_Credit_Debit_Post_API, data.data);
    yield put(GetCreditListSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// function* Delete_Credit_ID_GenFunc({ config }) {                   // delete API
//   try {
//     const response = yield call(del_Group_List_API, config);
//     yield put(deleteGrouplistSuccess(response))
//   } catch (error) { CommonConsole(error) }
// }
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

function* CreditDebitSaga() {
  yield takeEvery(SAVE_CREDIT, Save_Method_ForCredit_GenFun)
  yield takeEvery(GET_CREDIT_LIST, Get_Credit_List_GenFunc)
  // yield takeEvery(DELETE_CREDIT_LIST_ID, Delete_Credit_ID_GenFunc)
  yield takeEvery(CREDITDEBIT_TYPE, CreditDeitType_ID_GenFunc)
  // yield takeEvery(UPDATE_GROUPMASTER_ID, Update_Grouplist_ID_GenFunc)
}

export default CreditDebitSaga;