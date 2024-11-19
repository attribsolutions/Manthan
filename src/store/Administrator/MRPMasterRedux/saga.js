import { call, put, takeLatest } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionTypes";
import * as action from "./action";
import { date_dmy_func, date_ymd_func, listpageConcatDateAndTime } from "../../../components/Common/CommonFunction";

function* save_MRPMaster_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.MRPMaster_Post_API, config);
    yield put(action.saveMRPMasterSuccess(response));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}

// List Page API
function* get_MRPMaster_GenFunc({ config }) {

  try {
    const response = yield call(apiCall.MRPMaster_Get_API, config);

    response.Data.forEach(i => {
      i["transactionDateLabel"] = date_dmy_func(i.EffectiveDate);
      // i["transactionDateLabel"] = listpageConcatDateAndTime(i.EffectiveDate, i.CreatedOn);
      return i
    });

    yield put(action.getMRPList_Success(response.Data))
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}

//delete
function* delete_MRPList_Id_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.MRPMaster_Delete_API_For_List, config);
    yield put(action.deleteMRPList_Id_Success(response));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}

function* goButton_MRPMaster_GenFunc({ data }) {
  const { jsonBody, pathname, btnmode, rowData } = data
  try {
    const response = yield call(apiCall.MRPMaster_goButton_API, jsonBody);
    response.pageMode = btnmode
    response.pathname = pathname
    response.rowData = rowData
    yield put(action.GoButtonForMRP_MasterSuccess(response));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}


function* viewMRP_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.View_MRP_Details_API, config);
    response.Data?.MRPList.forEach(i => {
      i.EffectiveDate = date_dmy_func(i.EffectiveDate)
      return i
    });

    yield put(action.postViewMrpSuccess(response.Data));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}


// delete api MRP Master PageL
function* delete_MRPMaster_Id_GenFunc({ id }) {
  try {
    const response = yield call(apiCall.MRPMaster_Delete_API_For_Master, id);
    response["deletedId"] = id
    yield put(action.deleteMRPMaster_Id_Success(response));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}

function* MRPMasterSaga() {
  yield takeLatest(actionType.SAVE_MRP_MASTER, save_MRPMaster_GenFunc);
  yield takeLatest(actionType.POST_VIEW_MRP, viewMRP_GenFunc);

  yield takeLatest(actionType.GO_BUTTON_FOR_MRP_MASTER, goButton_MRPMaster_GenFunc);
  yield takeLatest(actionType.GET_MRP_LIST, get_MRPMaster_GenFunc);
  yield takeLatest(actionType.DELETE_MRP_LIST, delete_MRPList_Id_GenFunc);
  yield takeLatest(actionType.DELETE_MRP_MASTER_ID, delete_MRPMaster_Id_GenFunc);
}
export default MRPMasterSaga;
