import { call, put, takeEvery } from "redux-saga/effects";

import {
  delete_Production_ReIssueIdSuccess,
  edit_Production_ReIssueIdSuccess,
  getProduction_ReIssueistPageSuccess,
  goBtnProduction_ReIssue_AddpageSuccess,
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
  GO_BTN_FOR_PRODUNCTION_RE_ISSUE_ADD_PAGE,
  ITEM_FOR_PRODUNCTION_RE_ISSUE,
} from "./actionType";
import { convertDatefunc, convertTimefunc } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";
import { AlertState } from "../../actions";


function* saveProduction_ReIssueGenFunc({ data }) {
  ;
  try {
    const response = yield call(Production_ReIssue_save_API, data);
    yield put(Save_Production_ReIssueSuccess(response));
    ;
  } catch (error) {
    ;
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error PostProduction_ReIssue",
      })
    );
  }
}

function* DeleteProduction_ReIssueGenFunc({ id }) {
  ;
  try {
    const response = yield call(Production_ReIssue_Delete_API, id);
    ;

    yield put(delete_Production_ReIssueIdSuccess(response));

  } catch (error) {
    ;
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 Error Delete Production_ReIssue API",
      })
    );
  }
}

function* UpdateProduction_ReIssueGenFunc({ data, id }) {
  try {
    ;
    const response = yield call(id);
    ;
    yield put(update_Production_ReIssueIdSuccess(response));
  } catch (error) {
    ;
    yield put(
      AlertState({
        Type: 4,
        Status: true,
        Message: "500 ErrorUpdateGRN API",
      })
    );
  }
}

// List Page API
function* ListFilter_Production_ReIssue_GerFunc({ filters }) {
  debugger
  try {

    const response = yield call(Production_ReIssue_get_API, filters);
    // const newList = yield response.Data.map((i) => {
    //   var date = convertDatefunc(i.GRNDate)
    //   var time = convertTimefunc(i.CreatedOn)
    //   i.GRNDate = (`${date} ${time}`)
    //   return i
    // })

    const newList = response.Data.map((index) => {
      debugger
      index.Item = index.Item.Name;
      var date = convertDatefunc(index.Date)
      // var batchdate = convertDatefunc(index.BatchDate)
      var time = convertTimefunc(index.CreatedOn)
      // var batchtime = convertTimefunc(index.CreatedOn)
      index.ProductionReIssueDate = (`${date} ${time}`)
      // index.BatchDate = (`${batchdate} `)

      if (index.ProductionItem) {
        index.ProductionItem = index.ProductionItem.Name
      } else {
        index.ProductionItem = ''
      }
      return index;
    });
    ;
    yield put(getProduction_ReIssueistPageSuccess(newList));
  } catch (error) {
   
  }
}

// List Page API
// function* getProduction_ReIssue_Mode2_GenFunc({ data }) {
//   const { jsonBody, pageMode, path } = data;
// ;
//   try {
//     const response = yield call(production_Make_API, jsonBody);
//     response.Data = response.Data[0];
//     response["pageMode"] = pageMode;
//     response["path"] = path; //Pagepath

//    ;
//     // yield put(getProduction_ReIssue_Mode2_Success(response));
//   } catch (error) {
//    ;
//     yield put(
//       AlertState({
//         Type: 4,
//         Status: true,
//         Message: "500 Error get_PRODUCTION_RE_ISSUE Item API ",
//       })
//     );
//   }
// }

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

//  items dropdown list
function* itemsForProduction_ReIssue_GenFunc({ data }) {
  try {
    const response = yield call(Production_ReIssueItemDropdown_API, data);
    yield put(ItemForProdunction_ReIssueSuccess(response.Data));

  } catch (error) { }
}
//  items dropdown list
function* goBtnForProduction_ReIssue_AddPage_GenFunc({ data }) {

  try {
    const response = yield call(Production_ReIssue_AddPageGOBtn_API, data);

    yield put(goBtnProduction_ReIssue_AddpageSuccess(response.Data));

  } catch (error) { }
}

function* Production_ReIssueSaga() {
  yield takeEvery(EDIT_PRODUCTION_RE_ISSUE, editProduction_ReIssue_GenFunc);
  yield takeEvery(SAVE_PRODUCTION_RE_ISSUE_ADD_PAGE, saveProduction_ReIssueGenFunc);
  yield takeEvery(UPDATE_PRODUCTION_RE_ISSUE, UpdateProduction_ReIssueGenFunc);
  yield takeEvery(DELETE_PRODUCTION_RE_ISSUE_ID, DeleteProduction_ReIssueGenFunc);
  yield takeEvery(GET_PRODUCTION_RE_ISSUE_LIST_PAGE, ListFilter_Production_ReIssue_GerFunc);
  yield takeEvery(ITEM_FOR_PRODUNCTION_RE_ISSUE, itemsForProduction_ReIssue_GenFunc);
  yield takeEvery(GO_BTN_FOR_PRODUNCTION_RE_ISSUE_ADD_PAGE, goBtnForProduction_ReIssue_AddPage_GenFunc);
}
export default Production_ReIssueSaga;
