import { call, put, takeLatest } from "redux-saga/effects";
import { CentralServiceItemApiErrorAction, deleteCentralServiceItemListSuccess, editCentralServiceItemSuccess, getCentralServiceItemSuccess, saveCentralServiceItem_Success, updateCentralServiceItemIDSuccess } from "./action";
import {
  CentralServiceItem_Delete,
  CentralServiceItem_Edit,
  CentralServiceItem_Get,
  CentralServiceItem_Post,
  CentralServiceItem_Update,
} from "../../../helpers/backend_helper";
import { DELETE_CENTRAL_SERVICE_ITEM_LIST_ID, EDIT_CENTRAL_SERVICE_ITEM_ID, GET_CENTRAL_SERVICE_ITEM_LIST, SAVE_CENTRAL_SERVICE_ITEM, UPDATE_CENTRAL_SERVICE_ITEM_ID } from "./actionType";

function* Save_Method_CentralServiceItem_GenFun({ config }) {              // Save API
  try {
    const response = yield call(CentralServiceItem_Post, config);
    yield put(saveCentralServiceItem_Success(response));
  } catch (error) { yield put(CentralServiceItemApiErrorAction()) }
}

function* Get_CentralServiceItem_List_GenFunc() {                                   // getList API
  try {
    const response = yield call(CentralServiceItem_Get);
    yield put(getCentralServiceItemSuccess(response.Data));
  } catch (error) { yield put(CentralServiceItemApiErrorAction()) }
}

function* Delete_CentralServiceItem_ID_GenFunc({ config }) {                    // delete API
  try {
    const response = yield call(CentralServiceItem_Delete, config);
    yield put(deleteCentralServiceItemListSuccess(response))
  } catch (error) { yield put(CentralServiceItemApiErrorAction()) }
}

function* Edit_CentralServiceItem_ID_GenFunc({ config }) {                      // edit API 
  const { btnmode } = config;
  try {
    const response = yield call(CentralServiceItem_Edit, config);
    response.pageMode = btnmode;
    yield put(editCentralServiceItemSuccess(response));
  } catch (error) { yield put(CentralServiceItemApiErrorAction()) }
}

function* Update_CentralServiceItem_ID_GenFunc({ config }) {                    // update API
  try {
    const response = yield call(CentralServiceItem_Update, config);
    yield put(updateCentralServiceItemIDSuccess(response))
  } catch (error) { yield put(CentralServiceItemApiErrorAction()) }
}

function* CentralServiceItemSaga() {
  yield takeLatest(SAVE_CENTRAL_SERVICE_ITEM, Save_Method_CentralServiceItem_GenFun)
  yield takeLatest(GET_CENTRAL_SERVICE_ITEM_LIST, Get_CentralServiceItem_List_GenFunc)
  yield takeLatest(DELETE_CENTRAL_SERVICE_ITEM_LIST_ID, Delete_CentralServiceItem_ID_GenFunc)
  yield takeLatest(EDIT_CENTRAL_SERVICE_ITEM_ID, Edit_CentralServiceItem_ID_GenFunc)
  yield takeLatest(UPDATE_CENTRAL_SERVICE_ITEM_ID, Update_CentralServiceItem_ID_GenFunc)
}

export default CentralServiceItemSaga;