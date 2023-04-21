import { call, put, takeEvery } from "redux-saga/effects";
import * as  apiCall from "../../../helpers/backend_helper";
import * as actionType from "./actionTypes";
import * as action from "./action";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* Post_MRPMaster_GenratorFunction({ Data }) {
  try {
    const response = yield call(apiCall.Post_MRPMaster_API, Data);
    yield put(action.postMRPMasterDataSuccess(response));
    } catch (error) { CommonConsole(error) }
}

// List Page API
function* get_MRPListPage_GenratorFunction() {
  try {
    const response = yield call(apiCall.GetMRPList_For_Listpage);
    yield put(action.getMRPListPageSuccess(response.Data))
  } catch (error) { CommonConsole(error) }
}

//delete
function* delete_MRPListPage_GenratorFunction({ CommonID }) {
  try {
    const response = yield call(apiCall.delete_MRPList_API, CommonID);
    yield put(action.delete_MRPListSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_MRPListPage_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(apiCall.edit_MRPList, id);
    response.pageMode = pageMode
    yield put(action.editMRPListSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_MRPListPage_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(apiCall.update_MRPList, updateData, ID);
    yield put(action.updateMRPListSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* MRPGoButton_post_GenratorFunction({ data }) {
  try {
    const response = yield call(apiCall.GoButton_Post_API, data);
    yield put(action.postGoButtonForMRP_MasterSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api MRP Master PageL
function* deleteId_for_MasterPage_GenratorFunction({ id }) {
  try {
    const response = yield call(apiCall.MRP_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(action.deleteID_In_MasterPageSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* MRPMasterSaga() {
  yield takeEvery(actionType.POST_MRP_MASTER_DATA, Post_MRPMaster_GenratorFunction);
  yield takeEvery(actionType.POST_GO_BUTTON_FOR_MRP_MASTER, MRPGoButton_post_GenratorFunction);
  yield takeEvery(actionType.GET_MRP_LIST_PAGE, get_MRPListPage_GenratorFunction);
  yield takeEvery(actionType.DELETE_MRP_LIST_PAGE, delete_MRPListPage_GenratorFunction);
  yield takeEvery(actionType.EDIT_MRP_LIST_PAGE, Edit_MRPListPage_GenratorFunction);
  yield takeEvery(actionType.UPDATE_MRP_LIST_PAGE, Update_MRPListPage_GenratorFunction);
  yield takeEvery(actionType.DELETE_ID_IN_MASTERPAGE, deleteId_for_MasterPage_GenratorFunction);
}
export default MRPMasterSaga;
