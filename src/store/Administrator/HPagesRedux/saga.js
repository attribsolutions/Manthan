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
  getPageTypeSuccess,
  saveHPagesSuccess,
  updateHPagesSuccess,
  PageMasterApiErrorAction,
} from "./actions";
import {
  ControlTypes_DropDown_Api,
  deletHPagesUsingID_API,
  edit_HPageID,
  Fetch_HPagesListApi,
  GetFieldValidationOnControlType_DropDown_API,
  get_Module_HPages,
  saveHPagesAPI,
  showPagesListOnPageAccess_DropDown_List,
  get_PageType_HPages,
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
  GET_PAGETYPE,
  SAVE_HPAGES,
  UPDATE_H_PAGES,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* fetchHPagesList_GneratorFunction() {
  try {
    const response = yield call(Fetch_HPagesListApi);
    yield put(GetHpageListDataSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}


function* GetH_Modules() {
  try {
    const response = yield call(get_Module_HPages);
    yield put(getH_ModulesSuccess(response.Data))
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

function* saveHPageSaga_GneratorFunction({ Data }) {
  try {
    const response = yield call(saveHPagesAPI, Data);
    yield put(saveHPagesSuccess(response));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

function* editHpages_ID({ id, pageMode }) {

  try {
    let response = yield call(edit_HPageID, id);
    response.pageMode = id.btnmode
    yield put(editHPagesIDSuccess(response));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

function* update_HPagesUsingID_GenratorFunction({ data, id }) {
  try {
    const response = yield call(updateHPages, data, id);
    yield put(updateHPagesSuccess(response))
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

function* deleteHpagesUsingID_GenratorFunction({ id }) {
  try {
    const response = yield call(deletHPagesUsingID_API, id);
    yield put(deleteModuleIDSuccess(response))
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  PageType dropdown list
function* PageList_DropDown_GenratorFunction() {
  try {
    const response = yield call(showPagesListOnPageType_DropDown_List);
    yield put(getPageListSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  PageType dropdown list
function* PageType_DropDown_GenratorFunction() {
  try {
    const response = yield call(get_PageType_HPages);
    yield put(getPageTypeSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  PageAccess dropdown list
function* PageAccess_DropDown_GenratorFunction() {
  try {
    const response = yield call(showPagesListOnPageAccess_DropDown_List);
    yield put(getPageAccess_DropDown_API_Success(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  Control Types dropdown list
function* ControlTypes_DropDown_GenratorFunction() {
  try {
    const response = yield call(ControlTypes_DropDown_Api);
    yield put(getControlTypesSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  Field Validations dropdown list
function* FieldValidations_DropDown_GenratorFunction({ id }) {
  try {
    const response = yield call(GetFieldValidationOnControlType_DropDown_API, id);
    yield put(getFieldValidationsSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* HPageSaga() {
  yield takeEvery(SAVE_HPAGES, saveHPageSaga_GneratorFunction)
  yield takeEvery(GET_HPAGES_LIST_DATA, fetchHPagesList_GneratorFunction);
  yield takeEvery(EDIT_H_PAGES_ID, editHpages_ID);
  yield takeEvery(GET_H_SUB_MODULES, GetH_Modules);
  yield takeEvery(UPDATE_H_PAGES, update_HPagesUsingID_GenratorFunction);
  yield takeEvery(DELETE_HPAGES_USING_ID, deleteHpagesUsingID_GenratorFunction)
  yield takeEvery(GET_PAGELIST, PageList_DropDown_GenratorFunction)
  yield takeEvery(GET_PAGETYPE, PageType_DropDown_GenratorFunction)
  yield takeEvery(GET_PAGEACCESS_DROPDOWN_API, PageAccess_DropDown_GenratorFunction)
  yield takeEvery(GET_CONTROL_TYPES, ControlTypes_DropDown_GenratorFunction)
  yield takeEvery(GET_FIELD_VALIDATIONS, FieldValidations_DropDown_GenratorFunction)
}

export default HPageSaga;
