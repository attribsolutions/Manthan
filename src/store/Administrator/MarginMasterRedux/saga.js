import { call, put, takeLatest } from "redux-saga/effects";
import { date_dmy_func, listpageConcatDateAndTime } from "../../../components/Common/CommonFunction";
// import {listpageConcatDateAndTime} from "../../../components/Common/CommonFunction";
import {
  delete_MarginList_API,
  GetMarginList_For_Listpage,
  GoButton_Post_API_For_MarginMaster,
  Margin_MasterPage_delete_API,
  Post_MarginMaster_API,
} from "../../../helpers/backend_helper";
import {
  MarginApiErrorAction,
  deleteIdForMarginMasterSuccess,
  delete_MarginList_ID_Success,
  getMarginListSuccess,
  goButtonForMarginSuccess,
  saveMarginMasterSuccess,
} from "./action";
import {
  DELETE_ID_FOR_MARGIN_MASTER,
  DELETE_MARGIN_LIST_ID,
  GET_MARGIN_LIST,
  GO_BUTTON_FOR_MARGIN_MASTER,
  SAVE_MARGIN_MASTER,
} from "./actionType";

function* post_Margin_GenFunc({ config }) {
  try {
    const response = yield call(Post_MarginMaster_API, config);
    yield put(saveMarginMasterSuccess(response));
  } catch (error) { yield put(MarginApiErrorAction()) }
}

//listpage
function* get_Margin_GenFunc({ config }) {
  try {
    const response = yield call(GetMarginList_For_Listpage, config);
    response.Data.map(i => {
      //tranzaction date is only for fiterand page field but UI show transactionDateLabel
      i["transactionDateLabel"] = date_dmy_func(i.EffectiveDate);
      // i["transactionDateLabel"] = listpageConcatDateAndTime(i.EffectiveDate, i.CreatedOn);
    })
    yield put(getMarginListSuccess(response.Data))
  } catch (error) { yield put(MarginApiErrorAction()) }
}

//delete
function* delete_Margin_GenFunc({ config }) {

  try {
    const response = yield call(delete_MarginList_API, config);
    yield put(delete_MarginList_ID_Success(response));
  } catch (error) { yield put(MarginApiErrorAction()) }
}

function* goButton_Margin_GenFunc({ data }) {
  const { jsonBody, pathname, btnmode, rowData } = data
  try {

    const response = yield call(GoButton_Post_API_For_MarginMaster, jsonBody);
    response.pageMode = btnmode
    response.pathname = pathname
    response.rowData = rowData
    yield put(goButtonForMarginSuccess(response.Data));
  } catch (error) { yield put(MarginApiErrorAction()) }
}

// delete api Margin Master Page

function* delete_Margin_Master_table_GenFunc({ id }) {
  try {

    const response = yield call(Margin_MasterPage_delete_API, id);
    response["deletedId"] = id
    yield put(deleteIdForMarginMasterSuccess(response));
  } catch (error) { yield put(MarginApiErrorAction()) }
}

function* MarginMasterSaga() {
  yield takeLatest(SAVE_MARGIN_MASTER, post_Margin_GenFunc);
  yield takeLatest(GET_MARGIN_LIST, get_Margin_GenFunc);
  yield takeLatest(DELETE_MARGIN_LIST_ID, delete_Margin_GenFunc);
  yield takeLatest(GO_BUTTON_FOR_MARGIN_MASTER, goButton_Margin_GenFunc);
  yield takeLatest(DELETE_ID_FOR_MARGIN_MASTER, delete_Margin_Master_table_GenFunc);
}
export default MarginMasterSaga;
