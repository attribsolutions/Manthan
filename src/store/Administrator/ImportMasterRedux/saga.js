import { call, put, takeEvery } from "redux-saga/effects";
import {
  deleteExcel_ImportlistSuccess,
  editExcel_ImportIDSuccess,
  getExcel_ImportListSuccess,
  GoButton_Excel_ImportAddSuccess,
  saveExcel_ImportMaster_Success,
  updateExcel_ImportIDSuccess
} from "./action";
import {
  del_Excel_Import_List_API,
  edit_Excel_Import_List_Api,
  get_Excel_Import_List_Api,
  ImportMaster_Add_GoButton_API,
  ImportMaster_Add_Save_API,
  save_Excel_Import_API,
  update_Excel_Import_List_Api
} from "../../../helpers/backend_helper";
import {
  DELETE_EXCEL_IMPORT_LIST_ID,
  EDIT_EXCEL_IMPORTMASTER_ID,
  GET_EXCEL_IMPORT_LIST,
  GO_BUTTON_EXCEL_IMPORT_ADD,
  SAVE_EXCEL_IMPORT_MASTER,
  UPDATE_EXCEL_IMPORTMASTER_ID
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";





function* GoButtonExcel_ImportMaster_GenFun({ config }) {              // Go buuton add Page API
  try {
    const response = yield call(ImportMaster_Add_GoButton_API, config);
    yield put(GoButton_Excel_ImportAddSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ImportMaster_Add_Save_API, config);
    yield put(saveExcel_ImportMaster_Success(response));
  } catch (error) { CommonConsole(error) }
}

// function* Get_Excel_Import_List_GenFunc() {                                   // getList API
//   try {
//     const response = yield call(get_Excel_Import_List_Api);
//     yield put(getExcel_ImportListSuccess(response.Data));
//   } catch (error) { CommonConsole(error) }
// }

// function* Delete_Excel_ImportList_ID_GenFunc({ config }) {                    // delete API
//   try {
//     const response = yield call(del_Excel_Import_List_API, config);
//     yield put(deleteExcel_ImportlistSuccess(response))
//   } catch (error) { CommonConsole(error) }
// }

// function* Edit_Excel_Importlist_ID_GenFunc({ config }) {                      // edit API 
//   const { btnmode } = config;
//   try {
//     const response = yield call(edit_Excel_Import_List_Api, config);
//     response.pageMode = btnmode;
//     yield put(editExcel_ImportIDSuccess(response));
//   } catch (error) { CommonConsole(error) }
// }

// function* Update_Excel_Importlist_ID_GenFunc({ config }) {                    // update API
//   try {
//     const response = yield call(update_Excel_Import_List_Api, config);
//     yield put(updateExcel_ImportIDSuccess(response))
//   } catch (error) { CommonConsole(error) }
// }

function* ImportMaster_Saga() {
  yield takeEvery(GO_BUTTON_EXCEL_IMPORT_ADD, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_EXCEL_IMPORT_MASTER, Save_Method_ForExcel_ImportMaster_GenFun)
  // yield takeEvery(GET_EXCEL_IMPORT_LIST, Get_Excel_Import_List_GenFunc)
  // yield takeEvery(DELETE_EXCEL_IMPORT_LIST_ID, Delete_Excel_ImportList_ID_GenFunc)
  // yield takeEvery(EDIT_EXCEL_IMPORTMASTER_ID, Edit_Excel_Importlist_ID_GenFunc)
  // yield takeEvery(UPDATE_EXCEL_IMPORTMASTER_ID, Update_Excel_Importlist_ID_GenFunc)
}

export default ImportMaster_Saga;