import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionTypes";
import * as action from "./action";
import { CommonConsole, concatDateAndTime } from "../../../components/Common/CommonFunction";

function* save_MRPMaster_GenFunc({ config }) {
  try {
    const response = yield call(apiCall.MRPMaster_Post_API, config);
    yield put(action.saveMRPMasterSuccess(response));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}

// List Page API
function* get_MRPMaster_GenFunc() {
  try {
    const response = yield call(apiCall.MRPMaster_Get_API);
    response.Data.map(i => {
      i["preEffectiveDate"] = i.EffectiveDate
      i.EffectiveDate = concatDateAndTime(i.EffectiveDate, i.CreatedOn)
    })
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

// delete api MRP Master PageL
function* delete_MRPMaster_Id_GenFunc({ id }) {
  try {
    const response = yield call(apiCall.MRPMaster_Delete_API_For_Master, id);
    response["deletedId"] = id
    yield put(action.deleteMRPMaster_Id_Success(response));
  } catch (error) { yield put(action.MRPApiErrorAction()) }
}

function* MRPMasterSaga() {
  yield takeEvery(actionType.SAVE_MRP_MASTER, save_MRPMaster_GenFunc);
  yield takeEvery(actionType.GO_BUTTON_FOR_MRP_MASTER, goButton_MRPMaster_GenFunc);
  yield takeEvery(actionType.GET_MRP_LIST, get_MRPMaster_GenFunc);
  yield takeEvery(actionType.DELETE_MRP_LIST, delete_MRPList_Id_GenFunc);
  yield takeEvery(actionType.DELETE_MRP_MASTER_ID, delete_MRPMaster_Id_GenFunc);
}
export default MRPMasterSaga;
