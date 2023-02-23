import { call, put, takeEvery } from "redux-saga/effects";

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
  production_get_API,
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
  ITEM_FOR_PRODUNCTION_RE_ISSUE_SUCCESS,
  MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION,
  ITEM_FOR_PRODUNCTION_RE_ISSUE,
} from "./actionType";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { AlertState } from "../../actions";

// save  Production_ReIssue  Page API
function* saveProduction_ReIssueGenFunc({ data }) {
  try {
    const response = yield call(Production_ReIssue_save_API, data);
    yield put(Save_Production_ReIssueSuccess(response));
  } catch (error) { }
}
// Delete Production_ReIssue
function* DeleteProduction_ReIssueGenFunc({ id }) {
  try {
    const response = yield call(Production_ReIssue_Delete_API, id);
    yield put(delete_Production_ReIssueIdSuccess(response));
  } catch (error) { }
}

function* UpdateProduction_ReIssueGenFunc({ data, id }) {
  try {
    const response = yield call(id);
    yield put(update_Production_ReIssueIdSuccess(response));
  } catch (error) { }
}

// List Page API
function* ListFilter_Production_ReIssue_GerFunc({ filters }) {
  try {
    const response = yield call(Production_ReIssue_get_API, filters);
    const newList = response.Data.map((index) => {
      var date = convertDatefunc(index.Date)
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
  } catch (error) { }
}

// Edit Production_ReIssue  Page API
function* editProduction_ReIssue_GenFunc({ id, pageMode }) {
  try {
    const response = yield call(production_Edit_API, id);
    response["pageMode"] = pageMode;
    yield put(edit_Production_ReIssueIdSuccess(response));

  } catch (error) {
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error Edit Production_ReIssue API",
      })
    );
  };
};

//  Items dropdown list forn productionReIssue Add page
function* itemsForProduction_ReIssue_GenFunc({ data }) {
  try {
    const response = yield call(Production_ReIssueItemDropdown_API, data);
    yield put(ItemForProdunction_ReIssueSuccess(response.Data));

  } catch (error) { }
}

//  make btn  production_ReIssue STP  page
function* makeBtnForProduction_ReIssue_STP_GenFunc({ data }) {
  const { jsonBody, pageMode, path, produtionId } = data;
  try {
    const response = yield call(Production_ReIssue_AddPageGOBtn_API, jsonBody);
    const resp1 = { ...response, ...data }
    yield put(makeBtnProduction_ReIssue_STP_actionSuccess(resp1));

  } catch (error) { }
}

function* Production_ReIssueSaga() {
  yield takeEvery(EDIT_PRODUCTION_RE_ISSUE, editProduction_ReIssue_GenFunc);
  yield takeEvery(SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE, saveProduction_ReIssueGenFunc);
  yield takeEvery(UPDATE_PRODUCTION_RE_ISSUE, UpdateProduction_ReIssueGenFunc);
  yield takeEvery(DELETE_PRODUCTION_RE_ISSUE_ID, DeleteProduction_ReIssueGenFunc);
  yield takeEvery(GET_PRODUCTION_RE_ISSUE_LIST_PAGE, ListFilter_Production_ReIssue_GerFunc);
  yield takeEvery(ITEM_FOR_PRODUNCTION_RE_ISSUE, itemsForProduction_ReIssue_GenFunc);
  yield takeEvery(MAKE_BTN_FOR_PRODUNCTION_RE_ISSUE_STP_ACTION, makeBtnForProduction_ReIssue_STP_GenFunc);
}
export default Production_ReIssueSaga;
