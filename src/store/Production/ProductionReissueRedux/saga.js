import { call, put, takeLatest } from "redux-saga/effects";
import {
  delete_Production_ReIssueIdSuccess,
  edit_Production_ReIssueIdSuccess,
  getProduction_ReIssueistPageSuccess,
  makeBtnProduction_ReIssue_STP_actionSuccess,
  ItemForProdunction_ReIssueSuccess,
  Save_Production_ReIssueSuccess,
  update_Production_ReIssueIdSuccess,
} from "./actions";
import {
  Production_ReIssue_Delete_API,
  production_Edit_API,
  Production_ReIssue_save_API,
  Production_ReIssueItemDropdown_API,
  Production_ReIssue_AddPageGOBtn_API,
  Production_ReIssue_get_API,
} from "./../../../helpers/backend_helper";

import {
  DELETE_PRODUCTION_RE_ISSUE_ID,
  GET_PRODUCTION_RE_ISSUE_LIST_PAGE,
  SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE,
  UPDATE_PRODUCTION_RE_ISSUE,
  EDIT_PRODUCTION_RE_ISSUE,
  MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION,
  ITEM_FOR_PRODUNCTION_RE_ISSUE,
} from "./actionType";
import { CommonConsole, date_dmy_func, convertTimefunc } from "../../../components/Common/CommonFunction";
import { customAlert } from "../../../CustomAlert/ConfirmDialog";


function* saveProduction_ReIssueGenFunc({ data }) {               // Save Production_ReIssue  genrator function
  try {
    const response = yield call(Production_ReIssue_save_API, data);
    yield put(Save_Production_ReIssueSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* DeleteProduction_ReIssueGenFunc({ id }) {               // Delete Production_ReIssue  genrator function
  try {
    const response = yield call(Production_ReIssue_Delete_API, id);
    yield put(delete_Production_ReIssueIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* UpdateProduction_ReIssueGenFunc({ data, id }) {         //  Update Production_ReIssue  genrator function
  try {
    const response = yield call(id);
    yield put(update_Production_ReIssueIdSuccess(response));
  } catch (error) { CommonConsole(error) }
}

function* ListFilter_Production_ReIssue_GerFunc({ filters }) {    //  Production_ReIssue List Page Filter API
  try {
    const response = yield call(Production_ReIssue_get_API, filters);
    const newList = response.Data.map((index) => {
      var date = date_dmy_func(index.Date)
      var time = convertTimefunc(index.CreatedOn)
      index.ProductionReIssueDate = (`${date} ${time}`)
      if (index.ProductionItem) {
        index.ItemName = index.ProductionItem.Name
      } else {
        index.ItemName = ''
      }
      return index;
    });
    yield put(getProduction_ReIssueistPageSuccess(newList));
  } catch (error) { CommonConsole(error) }
}

function* editProduction_ReIssue_GenFunc({ id, pageMode }) {      // Edit Production_ReIssue  Page API
  try {
    const response = yield call(production_Edit_API, id);
    response["pageMode"] = pageMode;
    yield put(edit_Production_ReIssueIdSuccess(response));

  } catch (error) {
    yield put(
      customAlert({
        Type: 4,
        Status: true,
        Message: "500 Error Edit Production_ReIssue API",
      })
    );
  };
};

function* itemsForProduction_ReIssue_GenFunc({ data }) {          //  Items dropdown list forn productionReIssue Add page *
  try {
    const response = yield call(Production_ReIssueItemDropdown_API, data);
    yield put(ItemForProdunction_ReIssueSuccess(response.Data));

  } catch (error) { CommonConsole(error) }
}

function* makeBtnForProduction_ReIssue_STP_GenFunc({ data }) {
     //  make btn  production_ReIssue STP  page
  const { jsonBody} = data;
  try {
    const response = yield call(Production_ReIssue_AddPageGOBtn_API, jsonBody);
    const resp1 = { ...response, ...data }
    yield put(makeBtnProduction_ReIssue_STP_actionSuccess(resp1));

  } catch (error) { CommonConsole(error) }
}

function* Production_ReIssueSaga() {
  yield takeLatest(EDIT_PRODUCTION_RE_ISSUE, editProduction_ReIssue_GenFunc);
  yield takeLatest(SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE, saveProduction_ReIssueGenFunc);
  yield takeLatest(UPDATE_PRODUCTION_RE_ISSUE, UpdateProduction_ReIssueGenFunc);
  yield takeLatest(DELETE_PRODUCTION_RE_ISSUE_ID, DeleteProduction_ReIssueGenFunc);
  yield takeLatest(GET_PRODUCTION_RE_ISSUE_LIST_PAGE, ListFilter_Production_ReIssue_GerFunc);
  yield takeLatest(ITEM_FOR_PRODUNCTION_RE_ISSUE, itemsForProduction_ReIssue_GenFunc);
  yield takeLatest(MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION, makeBtnForProduction_ReIssue_STP_GenFunc);
}
export default Production_ReIssueSaga;
