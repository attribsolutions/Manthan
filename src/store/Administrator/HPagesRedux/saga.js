import { call, put, takeEvery } from "redux-saga/effects";
import {
  editHPagesIDSuccess,
  GetHpageListData,
  GetHpageListDataSuccess,
  getH_SubModulesSuccess,
  getPageListSuccess,
  getPageTypeSuccess,
  saveHPagesSuccess,
  updateHPagesSuccess,
} from "./actions";
import { AlertState } from "../../Utilites/CostumeAlert/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  deletHPagesUsingID_API,
  edit_HPageID,
  Fetch_HPagesListApi,
  get_H_SubModule_HPages,
  saveHPagesAPI,
  updateHPages
} from "../../../helpers/backend_helper";
import {
  DELETE_HPAGES_USING_ID,
  EDIT_H_PAGES_ID,
  GET_HPAGES_LIST_DATA,
  GET_H_SUB_MODULES,
  GET_PAGELIST,
  GET_PAGETYPE,
  SAVE_HPAGES,
  UPDATE_H_PAGES,
} from "./actionType";
import PageListDropdownData from "./PageListData";


function* fetchHPagesList_GneratorFunction() {
  // yield put(SpinnerState(true))
  try {
    const response = yield call(Fetch_HPagesListApi,put);
    console.log(response, "fetchHPagesList_GneratorFunction")
    yield put(SpinnerState(false))
    yield put(GetHpageListDataSuccess(response.Data));
  } catch (error) {
    console.log(" error fetchHPagesList_GneratorFunction", error)
    // yield put(SpinnerState(false))
    yield put(AlertState({ Type: 3, Status: true, Message: "Network error Message", RedirectPath: false, AfterResponseAction: false }));
  }
}
function* GetH_Sub_Modules({ id }) {
  try {
    const response = yield call(get_H_SubModule_HPages, id);
    yield put(getH_SubModulesSuccess(response.Data))
  } catch (error) {
    yield put(AlertState({ Type: 3, Status: true, Message: " GetH_Sub_Modules Network error Message", RedirectPath: false, AfterResponseAction: false }));
  }
}

function* saveHPageSaga_GneratorFunction({ data }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(saveHPagesAPI, data);
    yield put(SpinnerState(false));
    if (response.StatusCode === 200) {
      // yield put(saveHPagesSuccess({ Status: true }));
      debugger
      yield put(AlertState({ Type: 1, Status: true, Message: response.Message, RedirectPath: '/HpageList', AfterResponseAction: false }));
    } else {
      yield put(AlertState({ Type: 3, Status: true, Message: " save HPageSaga error ", RedirectPath: false, AfterResponseAction: false }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({ Type: 3, Status: true, Message: "Network error Message", RedirectPath: false, AfterResponseAction: false }));

  }
}
function* editHpages_ID({ id }) {
  try {
    const response = yield call(edit_HPageID, id);
    yield put(editHPagesIDSuccess(response));
    yield put(editHPagesIDSuccess({ status: 'false' }));
  } catch (error) {
    yield console.log("editHpages_ID  saga page error ***  :", error);
  }
}
function* update_HPagesUsingID_GenratorFunction({ data, id }) {

  yield put(SpinnerState(true))

  try {
    const response = yield call(updateHPages, data, id);
    yield put(SpinnerState(false))
    console.log("response", response)
    if (response.StatusCode === 200) {
      yield put(updateHPagesSuccess({ Status: true }));
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: GetHpageListData,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }

  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 3, Status: true,
      Message: "network Error",
      RedirectPath: false,
      AfterResponseAction: false
    }));
    console.log("update_Company  saga page error ***  :", error);
  }
}

function* deleteHpagesUsingID_GenratorFunction({ id }) {
  debugger
  yield put(SpinnerState(true))
  try {
    const response = yield call(deletHPagesUsingID_API, id);
    yield put(SpinnerState(false))

    if (response.StatusCode === 200) {
      yield put(AlertState({
        Type: 1, Status: true,
        Message: response.Message,
        RedirectPath: false,
        AfterResponseAction: GetHpageListData,
      }))
    }
    else {
      yield put(AlertState({
        Type: 3, Status: true,
        Message: " save HPageSaga error ",
        RedirectPath: false,
        AfterResponseAction: false
      }));
    }
  } catch (error) {
    yield put(SpinnerState(false))
    console.log("deleteCompany_ID  saga page error ***  :", error);
  }
}

//  PageType dropdown list
function* PageType_DropDown_GenratorFunction() {
  try {
    const response = yield call("");
    yield put(getPageTypeSuccess(response.Data));
  } catch (error) {
    console.log("PageType_saga page error", error);
  }
}

//  PageType dropdown list
function* PageList_DropDown_GenratorFunction() {
  try {
    // const response = yield call("");
    console.log("PageList Data saga file",PageListDropdownData.Data)
    yield put(getPageListSuccess(PageListDropdownData.Data));
  } catch (error) {
    console.log("PageList_saga page error", error);
  }
}
function* HPageSaga() {
  yield takeEvery(SAVE_HPAGES, saveHPageSaga_GneratorFunction)
  yield takeEvery(GET_HPAGES_LIST_DATA, fetchHPagesList_GneratorFunction);
  yield takeEvery(EDIT_H_PAGES_ID, editHpages_ID);
  yield takeEvery(GET_H_SUB_MODULES, GetH_Sub_Modules);
  yield takeEvery(UPDATE_H_PAGES, update_HPagesUsingID_GenratorFunction);
  yield takeEvery(DELETE_HPAGES_USING_ID, deleteHpagesUsingID_GenratorFunction)
  yield takeEvery(GET_PAGETYPE, PageType_DropDown_GenratorFunction)
  yield takeEvery(GET_PAGELIST, PageList_DropDown_GenratorFunction)


}

export default HPageSaga;
