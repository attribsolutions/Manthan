import { call, put, takeEvery } from "redux-saga/effects";
import {
  GoButton_ImportFiledMap_AddSuccess,
  save_ImportFiledMap_Success
} from "./action";
import {
  ImportField_Add_GoButton_API,
  ImportField_Add_Save_API,
} from "../../../helpers/backend_helper";
import {
  GO_BUTTON_IMPORT_FIELD_MAP_ADD,
  SAVE_IMPORT_FIELD_MAP,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";





function* GoButtonExcel_ImportMaster_GenFun({ config }) {              // Go buuton add Page API
  try {
    const response = yield call(ImportField_Add_GoButton_API, config);
    yield put(GoButton_ImportFiledMap_AddSuccess(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ImportField_Add_Save_API, config);
    yield put(save_ImportFiledMap_Success(response));
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

function* ImportFieldMap_Saga() {
  yield takeEvery(GO_BUTTON_IMPORT_FIELD_MAP_ADD, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_IMPORT_FIELD_MAP, Save_Method_ForExcel_ImportMaster_GenFun)
  // yield takeEvery(GET_EXCEL_IMPORT_LIST, Get_Excel_Import_List_GenFunc)
  // yield takeEvery(DELETE_EXCEL_IMPORT_LIST_ID, Delete_Excel_ImportList_ID_GenFunc)
  // yield takeEvery(EDIT_EXCEL_IMPORTMASTER_ID, Edit_Excel_Importlist_ID_GenFunc)
  // yield takeEvery(UPDATE_EXCEL_IMPORTMASTER_ID, Update_Excel_Importlist_ID_GenFunc)
}

export default ImportFieldMap_Saga;