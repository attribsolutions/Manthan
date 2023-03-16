import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteGRNIdSuccess,
  editGRNIdSuccess,
  getGRNListPageSuccess,
  getGRN_itemMode2_Success,
  saveGRNSuccess,
  updateGRNIdSuccess,
} from "./actions";
import {
  GRN_delete_API,
  GRN_Edit_API,
  GRN_get_API, GRN_Make_API, GRN_Post_API,
  GRN_update_API,
} from "../../../helpers/backend_helper";
import {
  DELETE_GRN_FOR_GRN_PAGE,
  EDIT_GRN_FOR_GRN_PAGE,
  GET_GRN_ITEM_MODE_2,
  GET_GRN_LIST_PAGE,
  SAVE_GRN_FROM_GRN_PAGE_ACTION,
  UPDATE_GRN_ID_FROM_GRN_PAGE,
} from "./actionType";
import { CommonConsole, convertDatefunc, convertTimefunc } from "../../../components/Common/CommonFunction";


function* saveGRNGenFunc({ config }) {            // Save GRN  genrator function
  try {
    const response = yield call(GRN_Post_API, config);
    yield put(saveGRNSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* DeleteGRNGenFunc({ config }) {            // Delete GRN  genrator function
  try {
    const response = yield call(GRN_delete_API, config);
    yield put(deleteGRNIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* Edit_GRN_GenratorFunction({ config }) { // Edit  GRN  genrator function
  try {
    const { btnmode } = config;
    const response = yield call(GRN_Edit_API, config);
    response.pageMode = btnmode
    response.Data = response.Data[0];
    yield put(editGRNIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* UpdateGRNGenFunc({ config }) {             // Upadte GRN  genrator function
  try {
    const response = yield call(GRN_update_API, config);
    yield put(updateGRNIdSuccess(response))
  } catch (error) { CommonConsole(error) }
}

function* GRNListfilterGerFunc({ config }) {          // Grn_List filter  genrator function
  try {
    const response = yield call(GRN_get_API, config);
    const newList = yield response.Data.map((i) => {
      var date = convertDatefunc(i.GRNDate)
      var time = convertTimefunc(i.CreatedOn)
      i.GRNDate = (`${date} ${time}`)
      return i
    })
    yield put(getGRNListPageSuccess(newList))
  } catch (error) { CommonConsole(error) }
}

function* getGRNitem_Mode2_GenFunc({ data }) {         // Make_GRN Items  genrator function
  const { jsonBody, pageMode = '', path = '', grnRef = [], challanNo = '' } = data
  try {
    const response = yield call(GRN_Make_API, jsonBody);
    response["pageMode"] = pageMode;
    response["path"] = path; //Pagepath
    response.Data["GRNReferences"] = grnRef;
    response.Data["challanNo"] = challanNo;
    yield put(getGRN_itemMode2_Success(response))
  } catch (error) { CommonConsole(error) }
}


function* GRNSaga() {

  yield takeEvery(GET_GRN_ITEM_MODE_2, getGRNitem_Mode2_GenFunc);
  yield takeEvery(SAVE_GRN_FROM_GRN_PAGE_ACTION, saveGRNGenFunc);
  yield takeEvery(EDIT_GRN_FOR_GRN_PAGE, Edit_GRN_GenratorFunction);
  yield takeEvery(UPDATE_GRN_ID_FROM_GRN_PAGE, UpdateGRNGenFunc)
  yield takeEvery(DELETE_GRN_FOR_GRN_PAGE, DeleteGRNGenFunc);
  yield takeEvery(GET_GRN_LIST_PAGE, GRNListfilterGerFunc);
}

export default GRNSaga;
