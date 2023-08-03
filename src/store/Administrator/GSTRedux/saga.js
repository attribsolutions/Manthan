import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";

function* save_GSTMaster_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Post_GSTMaster_API, config);
    yield put(action.saveGSTMasterSuccess(response));
  } catch (error) { yield put(action.GSTApiErrorAction()) }
}

//listpage
function* get_GSTList_GenFunc() {

  try {
    const response = yield call(apiCall.GetGSTList_For_Listpage);
    response.Data.map(i => {
      i["preEffectiveDate"] = i.EffectiveDate
      // i.EffectiveDate = concatDateAndTime(i.EffectiveDate, i.CreatedOn)
      i["transactionDate"] = i.CreatedOn;
      
    })
    yield put(action.getGSTListSuccess(response.Data));
  } catch (error) { yield put(action.GSTApiErrorAction()) }
}

// delete api for GST List
function* delete_GSTList_ID_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.delete_GSTList_API, config);
    yield put(action.deleteGSTListId_Success(response));
  } catch (error) { yield put(action.GSTApiErrorAction()) }

}

function* goButton_GST_GenFunc({ data }) {
  const { jsonBody, pathname, btnmode, rowData } = data
  try {
    const response = yield call(apiCall.GoButton_Post_API_For_GSTMaster, jsonBody);
    response.pageMode = btnmode
    response.pathname = pathname
    response.rowData = rowData
    yield put(action.goButtonForGST_Master_Success(response));
  } catch (error) { yield put(action.GSTApiErrorAction()) }
}

// delete api for GST Master
function* delete_GSTMaster_ID_GenFunc({ id }) {

  try {
    const response = yield call(apiCall.GST_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(action.deleteGSTId_ForMaster_Success(response))
  } catch (error) { yield put(action.GSTApiErrorAction()) }
}

function* GSTSaga() {
  yield takeLatest(actionType.SAVE_GST_MASTER, save_GSTMaster_GenFunc);
  yield takeLatest(actionType.GET_GST_LIST, get_GSTList_GenFunc);
  yield takeLatest(actionType.DELETE_GST_LIST_ID, delete_GSTList_ID_GenFunc);
  yield takeLatest(actionType.GO_BUTTON_FOR_GST_MASTER, goButton_GST_GenFunc);
  yield takeLatest(actionType.DELETE_GST_ID_FOR_MASTER, delete_GSTMaster_ID_GenFunc);

}

export default GSTSaga;
