import { call, put, takeEvery } from "redux-saga/effects";
import { GoButton_Post_API, MRP_MasterPage_delete_API, Post_MRPMaster_API } from "../../../helpers/backend_helper";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";

import {
  POST_MRP_MASTER_DATA,
  GET_MRP_LIST_PAGE,
  DELETE_MRP_LIST_PAGE,
  EDIT_MRP_LIST_PAGE,
  UPDATE_MRP_LIST_PAGE,
  POST_GO_BUTTON_FOR_MRP_MASTER,
  DELETE_ID_IN_MASTERPAGE
} from "./actionTypes";
import {
  delete_MRPList_API,
  edit_MRPList,
  GetMRPList_For_Listpage,
  update_MRPList,
} from "../../../helpers/backend_helper";

import {
  postMRPMasterDataSuccess,
  getMRPListPageSuccess,
  delete_MRPListSuccess,
  editMRPListSuccess,
  updateMRPListSuccess,
  postGoButtonForMRP_MasterSuccess,
  deleteID_In_MasterPageSuccess
} from "./action";


function* Post_MRPMaster_GenratorFunction({ Data }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(Post_MRPMaster_API, Data);
    yield put(SpinnerState(false))
    yield put(postMRPMasterDataSuccess(response));
    console.log("response", response)
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


//listpage
function* get_MRPListPage_GenratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(GetMRPList_For_Listpage);
    yield put(SpinnerState(false))
    yield put(getMRPListPageSuccess(response.Data));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

//delete
function* delete_MRPListPage_GenratorFunction({ CommonID }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(delete_MRPList_API, CommonID);
    yield put(SpinnerState(false))
    yield put(delete_MRPListSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// edit api
function* Edit_MRPListPage_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_MRPList, id);
    response.pageMode = pageMode
    yield put(editMRPListSuccess(response));
    console.log("response in saga", response)

  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

// update api
function* Update_MRPListPage_GenratorFunction({ updateData, ID }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(update_MRPList, updateData, ID);
    yield put(SpinnerState(false))
    yield put(updateMRPListSuccess(response))
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* MRPGoButton_post_GenratorFunction({ data }) {

  yield put(SpinnerState(true))
  try {
    const response = yield call(GoButton_Post_API, data);
    yield put(SpinnerState(false))
    yield put(postGoButtonForMRP_MasterSuccess(response.Data));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}


// delete api MRP Master Page
function* deleteId_for_MasterPage_GenratorFunction({ id }) {

  yield put(SpinnerState(true))
  try {
    let response = yield call(MRP_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(deleteID_In_MasterPageSuccess(response));
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* MRPMasterSaga() {
  yield takeEvery(POST_MRP_MASTER_DATA, Post_MRPMaster_GenratorFunction);
  yield takeEvery(POST_GO_BUTTON_FOR_MRP_MASTER, MRPGoButton_post_GenratorFunction);
  yield takeEvery(GET_MRP_LIST_PAGE, get_MRPListPage_GenratorFunction);
  yield takeEvery(DELETE_MRP_LIST_PAGE, delete_MRPListPage_GenratorFunction);
  yield takeEvery(EDIT_MRP_LIST_PAGE, Edit_MRPListPage_GenratorFunction);
  yield takeEvery(UPDATE_MRP_LIST_PAGE, Update_MRPListPage_GenratorFunction);
  yield takeEvery(DELETE_ID_IN_MASTERPAGE, deleteId_for_MasterPage_GenratorFunction);
}
export default MRPMasterSaga;
