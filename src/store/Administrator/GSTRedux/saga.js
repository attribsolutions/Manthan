import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { date_dmy_func, listpageConcatDateAndTime } from "../../../components/Common/CommonFunction";
import { url } from "../../../routes";

function* save_GSTMaster_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.Post_GSTMaster_API, config);
    yield put(action.saveGSTMasterSuccess(response));
  } catch (error) { yield put(action.GSTApiErrorAction()) }
}

//listpage
function* get_GSTList_GenFunc({ config }) {

  try {
    const response = yield call(apiCall.GetGSTList_For_Listpage, config);
    response.Data.map(i => {

      //tranzaction date is only for fiterand page field but UI show transactionDateLabel
      i["transactionDateLabel"] = date_dmy_func(i.EffectiveDate);
      // i["transactionDateLabel"] = listpageConcatDateAndTime(i.EffectiveDate, i.CreatedOn);
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

function* viewGST_GenFunc({ config }) {
  const { subPageMode } = config
  try {
    let response
    if (subPageMode === url.MARGIN_lIST) {
      response = yield call(apiCall.View_Margin_Details_API, config);
      response.Data?.MarginList.forEach(i => {
        i.EffectiveDate = date_dmy_func(i.EffectiveDate)
        return i
      });
    } else {
      response = yield call(apiCall.View_GST_Details_API, config);
      response.Data?.GSTHSNList.forEach(i => {
        i.EffectiveDate = date_dmy_func(i.EffectiveDate)
        return i
      });
    }

    yield put(action.postViewGst_Success(response.Data));
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
  yield takeLatest(actionType.POST_VIEW_GST, viewGST_GenFunc);
  yield takeLatest(actionType.GET_GST_LIST, get_GSTList_GenFunc);
  yield takeLatest(actionType.DELETE_GST_LIST_ID, delete_GSTList_ID_GenFunc);
  yield takeLatest(actionType.GO_BUTTON_FOR_GST_MASTER, goButton_GST_GenFunc);
  yield takeLatest(actionType.DELETE_GST_ID_FOR_MASTER, delete_GSTMaster_ID_GenFunc);

}

export default GSTSaga;
