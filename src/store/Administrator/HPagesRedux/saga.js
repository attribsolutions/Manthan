import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteModuleIDSuccess,
  editHPagesIDSuccess,
  getControlTypesSuccess,
  getFieldValidationsSuccess,
  GetHpageListDataSuccess,
  getH_ModulesSuccess,
  getPageAccess_DropDown_API_Success,
  getPageListSuccess,
  saveHPagesSuccess,
  updateHPagesSuccess,
} from "./actions";
import { AlertState } from "../../Utilites/CustomAlertRedux/actions";
import { SpinnerState } from "../../Utilites/Spinner/actions";
import {
  ControlTypes_DropDown_Api,
  deletHPagesUsingID_API,
  edit_HPageID,
  Fetch_HPagesListApi,
  GetFieldValidationOnControlType_DropDown_API,
  get_Module_HPages,
  saveHPagesAPI,
  showPagesListOnPageAccess_DropDown_List,
  showPagesListOnPageType_DropDown_List,
  updateHPages
} from "../../../helpers/backend_helper";
import {
  DELETE_HPAGES_USING_ID,
  EDIT_H_PAGES_ID,
  GET_CONTROL_TYPES,
  GET_FIELD_VALIDATIONS,
  GET_HPAGES_LIST_DATA,
  GET_H_SUB_MODULES,
  GET_PAGEACCESS_DROPDOWN_API,
  GET_PAGELIST,
  SAVE_HPAGES,
  UPDATE_H_PAGES,
} from "./actionType";

function* fetchHPagesList_GneratorFunction() {
  yield put(SpinnerState(true))
  try {
    const response = yield call(Fetch_HPagesListApi);
    yield put(GetHpageListDataSuccess(response.Data));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* GetH_Modules({ id }) {
  try {

    const response = yield call(get_Module_HPages, id);
    yield put(getH_ModulesSuccess(response.Data))
  } catch (error) {
    yield put(AlertState({
      Type: 3,
      Status: true,
      Message: " GetH_Sub_Modules Network error Message",
      RedirectPath: false,
      AfterResponseAction: false
    }));
  }
}

function* saveHPageSaga_GneratorFunction({ Data }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(saveHPagesAPI, Data);
    yield put(SpinnerState(false))
    yield put(saveHPagesSuccess(response));
    console.log("Post response", response)
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* editHpages_ID({ id,pageMode }) {
  try {
    let response = yield call(edit_HPageID, id);
    response.pageMode=pageMode
    yield put(editHPagesIDSuccess(response));
  } catch (error) {
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* update_HPagesUsingID_GenratorFunction({ data, id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(updateHPages, data, id);

    yield put(SpinnerState(false))
    yield put(updateHPagesSuccess(response))
    console.log("update response in saga ", response)
  }
  catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}

function* deleteHpagesUsingID_GenratorFunction({ id }) {
  try {
    yield put(SpinnerState(true))
    const response = yield call(deletHPagesUsingID_API, id);
    yield put(SpinnerState(false))
    yield put(deleteModuleIDSuccess(response))
  } catch (error) {
    yield put(SpinnerState(false))
    yield put(AlertState({
      Type: 4,
      Status: true, Message: "500 Error Message",
    }));
  }
}
//  PageType dropdown list
function* PageList_DropDown_GenratorFunction() {
  try {
    const response = yield call(showPagesListOnPageType_DropDown_List);
    yield put(getPageListSuccess(response.Data));
  } catch (error) {
    console.log("PageList_saga page error", error);
  }
}

//  PageAccess dropdown list
function* PageAccess_DropDown_GenratorFunction() {
  try {
    const response = yield call(showPagesListOnPageAccess_DropDown_List);
    yield put(getPageAccess_DropDown_API_Success(response.Data));
  } catch (error) {
    console.log("PageList_saga page error", error);
  }
}

//  Control Types dropdown list
function* ControlTypes_DropDown_GenratorFunction() {
  try {
    const response = yield call(ControlTypes_DropDown_Api);
    yield put(getControlTypesSuccess(response.Data));
  } catch (error) {
  }
}

//  Field Validations dropdown list
function* FieldValidations_DropDown_GenratorFunction({ id }) {
  try {
    const response = yield call(GetFieldValidationOnControlType_DropDown_API,id);
    yield put(getFieldValidationsSuccess(response.Data));
  } catch (error) {
  }
}
function* HPageSaga() {
  yield takeEvery(SAVE_HPAGES, saveHPageSaga_GneratorFunction)
  yield takeEvery(GET_HPAGES_LIST_DATA, fetchHPagesList_GneratorFunction);
  yield takeEvery(EDIT_H_PAGES_ID, editHpages_ID);
  yield takeEvery(GET_H_SUB_MODULES, GetH_Modules);
  yield takeEvery(UPDATE_H_PAGES, update_HPagesUsingID_GenratorFunction);
  yield takeEvery(DELETE_HPAGES_USING_ID, deleteHpagesUsingID_GenratorFunction)
  yield takeEvery(GET_PAGELIST, PageList_DropDown_GenratorFunction)
  yield takeEvery(GET_PAGEACCESS_DROPDOWN_API, PageAccess_DropDown_GenratorFunction)
  yield takeEvery(GET_CONTROL_TYPES, ControlTypes_DropDown_GenratorFunction)
  yield takeEvery(GET_FIELD_VALIDATIONS, FieldValidations_DropDown_GenratorFunction)
}

export default HPageSaga;
