import { call, put, takeLatest } from "redux-saga/effects";
import { ClusterApiErrorAction, deleteClusterIDSuccess, editClusterIDSuccess, getClusterlistSuccess, saveClusterMaster_Success, updateClusterIDSuccess } from "./action";
import { DELETE_CLUSTER_ID, EDIT_CLUSTER_ID, GET_CLUSTER_LIST, SAVE_CLUSTER_MASTER, UPDATE_CLUSTER_ID } from "./actionType";
import { Cluster_Post_API, Cluster_delete_API, Cluster_edit_API, Cluster_get_API, Cluster_update_API } from "../../../helpers/backend_helper";

function* save_Method_ForCluster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(Cluster_Post_API, config);
    yield put(saveClusterMaster_Success(response));
  } catch (error) { yield put(ClusterApiErrorAction()) }
}

function* Get_Cluster_List_GenratorFunction() {                    // getList API
  try {
    const response = yield call(Cluster_get_API);
    yield put(getClusterlistSuccess(response.Data));
  } catch (error) { yield put(ClusterApiErrorAction()) }
}

function* Delete_Cluster_ID_GenratorFunction({ config }) {          // delete API
  try {
    const response = yield call(Cluster_delete_API, config);
    yield put(deleteClusterIDSuccess(response))
  } catch (error) { yield put(ClusterApiErrorAction()) }
}

function* Edit_Cluster_ID_GenratorFunction({ config }) {           // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(Cluster_edit_API, config);
    response.pageMode = btnmode;
    yield put(editClusterIDSuccess(response));
  } catch (error) { yield put(ClusterApiErrorAction()) }
}


function* Update_Cluster_ID_GenratorFunction({ config }) {         // update API
  try {
    const response = yield call(Cluster_update_API, config);
    yield put(updateClusterIDSuccess(response))
  } catch (error) { yield put(ClusterApiErrorAction()) }
}

function* ClusterSaga() {
  yield takeLatest(SAVE_CLUSTER_MASTER, save_Method_ForCluster_GenFun)
  yield takeLatest(GET_CLUSTER_LIST, Get_Cluster_List_GenratorFunction)
  yield takeLatest(DELETE_CLUSTER_ID, Delete_Cluster_ID_GenratorFunction)
  yield takeLatest(EDIT_CLUSTER_ID, Edit_Cluster_ID_GenratorFunction)
  yield takeLatest(UPDATE_CLUSTER_ID, Update_Cluster_ID_GenratorFunction)
}

export default ClusterSaga;