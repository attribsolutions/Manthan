import { call, put, takeLatest } from "redux-saga/effects";
import {


  edit_PageListID_Success,
  getControlTypesSuccess,
  getFieldValidationsSuccess,
  Get_pageListAction_Success,
  getPageAccess_DropDown_API_Success,
  RelatedPageListDropdownSuccess,
  save_PageMaster_Success,
  update_PageListId_Success,
  PageMasterApiErrorAction,
  delete_PageListID_Success,
  getPageTypeSuccess,
  getFieldValidationsForALLTypeSuccess,
} from "./actions";
import {
  ControlTypes_DropDown_Api,
  PageMaster_Delete_API,
  PageMaster_Edit_API,
  PageMaster_Get_API,
  GetFieldValidationOnControlType_DropDown_API,
  PageMaster_Post_API,
  showPagesListOnPageAccess_DropDown_List,
  showPagesListOnPageType_DropDown_List,
  PageMaster_Update_API,
  get_PageType_HPages
} from "../../../helpers/backend_helper";
import {
  DELETE_PAGE_LIST_ID_ACTION,
  EDIT_PAGE_LIST_ID_ACTION,
  GET_CONTROL_TYPES,
  GET_FIELD_VALIDATIONS,
  GET_PAGES_LIST_ACTION,
  GET_PAGEACCESS_DROPDOWN_API,
  RELATED_PAGELIST_DROPDOWN_ACTION,
  SAVE_PAGE_MASTER_ACTION,
  UPDATE_PAGE_LIST_ID_ACTION,
  GET_PAGETYPE,
  GET_FIELD_VALIDATIONS_FOR_ALL_TYPE,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";

// List API
function* PagesList_GenFun() {
  try {
    const response = yield call(PageMaster_Get_API);
    yield put(Get_pageListAction_Success(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

// Post API
function* savePageMaster_GenFun({ config }) {
  try {
    const response = yield call(PageMaster_Post_API, config);
    yield put(save_PageMaster_Success(response));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

// Edit API
function* edit_pageListID_GenFun({ config }) {
  const { btnmode } = config;
  try {
    let response = yield call(PageMaster_Edit_API, config);
    response.pageMode = btnmode
    yield put(edit_PageListID_Success(response));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

// Update API
function* update_PageListID_GenFun({ config }) {
  try {
    const response = yield call(PageMaster_Update_API, config);
    yield put(update_PageListId_Success(response))
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

// Delete API
function* delete_pageListID_GenFun({ config }) {
  try {
    const response = yield call(PageMaster_Delete_API, config);
    yield put(delete_PageListID_Success(response))
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  Related Page List dropdown 
function* RelatedPageList_DropDown_GenFun() {
  try {
    const response = yield call(showPagesListOnPageType_DropDown_List);
    yield put(RelatedPageListDropdownSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  PageType dropdown list
function* PageType_DropDown_GenFunc() {
  try {
    const response = yield call(get_PageType_HPages);
    yield put(getPageTypeSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  PageAccess dropdown list
function* PageAccess_DropDown_GenFun() {
  try {
    const response = yield call(showPagesListOnPageAccess_DropDown_List);
    yield put(getPageAccess_DropDown_API_Success(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  Control Types dropdown list
function* ControlTypes_DropDown_GenFun() {
  try {
    const response = yield call(ControlTypes_DropDown_Api);
    yield put(getControlTypesSuccess(response.Data));
  } catch (error) { yield put(PageMasterApiErrorAction()) }
}

//  Field Validations dropdown list
function* FieldValidations_DropDown_GenFun({ id }) {
  try {
    const response = yield call(GetFieldValidationOnControlType_DropDown_API, id);
    yield put(getFieldValidationsSuccess(response.Data));
  } catch (error) {
    CommonConsole(error);
    yield put(PageMasterApiErrorAction());
  }
}

//  Field Validations dropdown list
function* FieldValidationsForAllTypeGenFun({ }) {
  try {
    const type1Resp = yield call(GetFieldValidationOnControlType_DropDown_API, 1);
    const type2Resp = yield call(GetFieldValidationOnControlType_DropDown_API, 2);
    const type3Resp = yield call(GetFieldValidationOnControlType_DropDown_API, 3);
    const type4Resp = yield call(GetFieldValidationOnControlType_DropDown_API, 4);
    const type5Resp = yield call(GetFieldValidationOnControlType_DropDown_API, 5);
    if ((type1Resp.StatusCode === 200)
      || (type2Resp.StatusCode === 200)
      || (type3Resp.StatusCode === 200)
      || (type4Resp.StatusCode === 200)
      || (type5Resp.StatusCode === 200)) {

      let response = [
        { type: 1, data: type1Resp.Data },
        { type: 2, data: type2Resp.Data },
        { type: 3, data: type3Resp.Data },
        { type: 4, data: type4Resp.Data },
        { type: 5, data: type5Resp.Data }
      ]
      yield put(getFieldValidationsForALLTypeSuccess(response));
    }
  } catch (error) {
    CommonConsole(error);
    yield put(PageMasterApiErrorAction());
  }
}

function* HPageSaga() {
  yield takeLatest(SAVE_PAGE_MASTER_ACTION, savePageMaster_GenFun)
  yield takeLatest(GET_PAGES_LIST_ACTION, PagesList_GenFun);
  yield takeLatest(EDIT_PAGE_LIST_ID_ACTION, edit_pageListID_GenFun);
  yield takeLatest(UPDATE_PAGE_LIST_ID_ACTION, update_PageListID_GenFun);
  yield takeLatest(DELETE_PAGE_LIST_ID_ACTION, delete_pageListID_GenFun)
  yield takeLatest(RELATED_PAGELIST_DROPDOWN_ACTION, RelatedPageList_DropDown_GenFun)
  yield takeLatest(GET_PAGEACCESS_DROPDOWN_API, PageAccess_DropDown_GenFun)
  yield takeLatest(GET_CONTROL_TYPES, ControlTypes_DropDown_GenFun)
  yield takeLatest(GET_FIELD_VALIDATIONS, FieldValidations_DropDown_GenFun)
  yield takeLatest(GET_PAGETYPE, PageType_DropDown_GenFunc)
  yield takeLatest(GET_FIELD_VALIDATIONS_FOR_ALL_TYPE, FieldValidationsForAllTypeGenFun)
}

export default HPageSaga;
