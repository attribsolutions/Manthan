import { call, put, takeLatest } from "redux-saga/effects";
import { Sub_Cluster_Post_API, Sub_Cluster_delete_API, Sub_Cluster_edit_API, Sub_Cluster_get_API, Sub_Cluster_update_API } from "../../../helpers/backend_helper";
import { DELETE_SUB_CLUSTER_ID, EDIT_SUB_CLUSTER_ID, GET_SUB_CLUSTER_LIST, SAVE_SUB_CLUSTER_MASTER, UPDATE_SUB_CLUSTER_ID } from "./actionType";
import { Sub_ClusterApiErrorAction, deleteSub_ClusterIDSuccess, editSub_ClusterIDSuccess, getSub_ClusterlistSuccess, saveSub_ClusterMaster_Success, updateSub_ClusterIDSuccess } from "./action";

function* save_SubCluster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(Sub_Cluster_Post_API, config);
    yield put(saveSub_ClusterMaster_Success(response));
  } catch (error) { yield put(Sub_ClusterApiErrorAction()) }
}

function* Get_SubCluster_List_GenFun() {                    // getList API
  try {
    const response = yield call(Sub_Cluster_get_API);
    yield put(getSub_ClusterlistSuccess(response.Data));
  } catch (error) { yield put(Sub_ClusterApiErrorAction()) }
}

function* Delete_SubCluster_ID_GenFun({ config }) {          // delete API
  try {
    const response = yield call(Sub_Cluster_delete_API, config);
    yield put(deleteSub_ClusterIDSuccess(response))
  } catch (error) { yield put(Sub_ClusterApiErrorAction()) }
}

function* Edit_SubCluster_ID_GenFun({ config }) {           // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(Sub_Cluster_edit_API, config);
    response.pageMode = btnmode;
    yield put(editSub_ClusterIDSuccess(response));
  } catch (error) { yield put(Sub_ClusterApiErrorAction()) }
}


function* Update_SubCluster_ID_GenFun({ config }) {         // update API
  try {
    const response = yield call(Sub_Cluster_update_API, config);
    yield put(updateSub_ClusterIDSuccess(response))
  } catch (error) { yield put(Sub_ClusterApiErrorAction()) }
}

function* SubSubClusterSaga() {
  yield takeLatest(SAVE_SUB_CLUSTER_MASTER, save_SubCluster_GenFun)
  yield takeLatest(GET_SUB_CLUSTER_LIST, Get_SubCluster_List_GenFun)
  yield takeLatest(DELETE_SUB_CLUSTER_ID, Delete_SubCluster_ID_GenFun)
  yield takeLatest(EDIT_SUB_CLUSTER_ID, Edit_SubCluster_ID_GenFun)
  yield takeLatest(UPDATE_SUB_CLUSTER_ID, Update_SubCluster_ID_GenFun)
}

export default SubSubClusterSaga;