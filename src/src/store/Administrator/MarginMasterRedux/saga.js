import { call, put, takeEvery } from "redux-saga/effects";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/CommonFunction";
import {
  delete_MarginList_API,
  edit_MarginList,
  GetMarginList_For_Listpage,
  GoButton_Post_API_For_MarginMaster,
  Margin_MasterPage_delete_API,
  Post_MarginMaster_API,
  update_MarginList
} from "../../../helpers/backend_helper";
import {
  deleteID_In_Margin_MasterPageSuccess,
  delete_MarginListSuccess,
  editMarginListSuccess,
  getMarginListPageSuccess,
  postGoButtonForMargin_Master_Success,
  postMarginMasterDataSuccess,
  updateMarginListSuccess,
} from "./action";
import {
  DELETE_ID_IN_MARGIN_MASTERPAGE,
  DELETE_MARGIN_LIST_PAGE,
  EDIT_MARGIN_LIST_PAGE,
  GET_MARGIN_LIST_PAGE,
  POST_GO_BUTTON_FOR_MARGIN_MASTER,
  POST_MARGIN_MASTER_DATA,
  UPDATE_MARGIN_LIST_PAGE
} from "./actionType";

function* Post_MarginMaster_GenratorFunction({ Data }) {
  try {
    const response = yield call(Post_MarginMaster_API, Data);
    yield put(postMarginMasterDataSuccess(response));
  } catch (error) { CommonConsole(error) }
}

//listpage
function* get_MarginListPage_GenratorFunction() {
  try {
    const response = yield call(GetMarginList_For_Listpage);
    yield put(getMarginListPageSuccess(response.Data))
  } catch (error) { CommonConsole(error) }
}

//delete
function* delete_MarginListPage_GenratorFunction({ CommonID }) {
  try {
    const response = yield call(delete_MarginList_API, CommonID);
    yield put(delete_MarginListSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// edit api
function* Edit_MarginListPage_GenratorFunction({ id, pageMode }) {
  try {
    const response = yield call(edit_MarginList, id);
    response.pageMode = pageMode
    yield put(editMarginListSuccess(response));
  } catch (error) { CommonConsole(error) }
}

// update api
function* Update_MarginListPage_GenratorFunction({ updateData, ID }) {
  try {
    const response = yield call(update_MarginList, updateData, ID);
    yield put(updateMarginListSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* MarginGoButton_post_GenratorFunction({ data }) {
  try {
    const response = yield call(GoButton_Post_API_For_MarginMaster, data);
    yield put(postGoButtonForMargin_Master_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

// delete api Margin Master Page
function* deleteId_for_MarginMaster_GenratorFunction({ id }) {
  try {
    const response = yield call(Margin_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(deleteID_In_Margin_MasterPageSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* MarginMasterSaga() {
  yield takeEvery(POST_MARGIN_MASTER_DATA, Post_MarginMaster_GenratorFunction);
  yield takeEvery(GET_MARGIN_LIST_PAGE, get_MarginListPage_GenratorFunction);
  yield takeEvery(DELETE_MARGIN_LIST_PAGE, delete_MarginListPage_GenratorFunction);
  yield takeEvery(EDIT_MARGIN_LIST_PAGE, Edit_MarginListPage_GenratorFunction);
  yield takeEvery(UPDATE_MARGIN_LIST_PAGE, Update_MarginListPage_GenratorFunction);
  yield takeEvery(POST_GO_BUTTON_FOR_MARGIN_MASTER, MarginGoButton_post_GenratorFunction);
  yield takeEvery(DELETE_ID_IN_MARGIN_MASTERPAGE, deleteId_for_MarginMaster_GenratorFunction);
}
export default MarginMasterSaga;
