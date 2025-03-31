import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionType";
import * as action from "./action";
import { listpageConcatDateAndTime } from "../../../components/Common/CommonFunction";

function* save_RateMaster_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.RateMaster_Post_API, config);
    yield put(action.saveRateMasterSuccess(response));
  } catch (error) { yield put(action.RateApiErrorAction()) }
}

function* goButton_Rate_GenFunc({ data }) {
  const { jsonBody, pathname, btnmode, rowData } = data
  try {

    const response = yield call(apiCall.GoButton_Post_API_For_RateMaster, jsonBody);
    response.pageMode = btnmode
    response.pathname = pathname
    response.rowData = rowData
    const newList = response.Data.map((i) => ({
      ...i,
      ['defaultUnit']: { value: i.UnitID, label: i.UnitName }
    }));
    yield put(action.goButtonForRate_Master_Success(newList));
  } catch (error) { yield put(action.RateApiErrorAction()) }
}

// delete api for GST Master
function* delete_RateMaster_ID_GenFunc({ id }) {

  try {
    const response = yield call(apiCall.Rate_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(action.deleteRateId_ForMaster_Success(response))
  } catch (error) { yield put(action.RateApiErrorAction()) }
}

//listpage
function* get_RateList_GenFunc() {

  try {
    const response = yield call(apiCall.GetRateList_For_Listpage);
    response.Data.map(i => {

      //tranzaction date is only for fiterand page field but UI show transactionDateLabel
      i["transactionDate"] = i.CreatedOn;
      i["transactionDateLabel"] = listpageConcatDateAndTime(i.EffectiveDate, i.CreatedOn);

      if (!i.PartyName) {
        i.PartyName = "All"
      }

    })
    yield put(action.getRateListSuccess(response.Data));
  } catch (error) { yield put(action.RateApiErrorAction()) }
}

// delete api for GST List
function* delete_RateList_ID_GenFunc({ config }) {
  debugger
  try {
    config["deleteId"] = config.CommonID
    const response = yield call(apiCall.delete_RateList_API, config);
    yield put(action.deleteRateListId_Success(response));
  } catch (error) { yield put(action.RateApiErrorAction()) }

}

function* RateMasterSaga() {
  yield takeLatest(actionType.SAVE_RATE_MASTER, save_RateMaster_GenFunc);
  yield takeLatest(actionType.GO_BUTTON_FOR_RATE_MASTER, goButton_Rate_GenFunc);
  yield takeLatest(actionType.DELETE_RATE_ID_FOR_MASTER, delete_RateMaster_ID_GenFunc);

  yield takeLatest(actionType.GET_RATE_LIST, get_RateList_GenFunc);
  yield takeLatest(actionType.DELETE_RATE_LIST_ID, delete_RateList_ID_GenFunc);

}


export default RateMasterSaga;
