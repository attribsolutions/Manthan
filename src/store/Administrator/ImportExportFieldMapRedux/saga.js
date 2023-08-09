import { call, put, takeEvery } from "redux-saga/effects";
import {
  GoButton_ImportFiledMap_AddSuccess,
  ImportFiledMap_ApiErrorAction,
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
  } catch (error) {
    yield put(ImportFiledMap_ApiErrorAction());
    CommonConsole(error);
  }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ImportField_Add_Save_API, config);
    yield put(save_ImportFiledMap_Success(response));
  } catch (error) {
    yield put(ImportFiledMap_ApiErrorAction());
    CommonConsole(error);
  }
}

function* ImportExcelFieldMap_Saga() {
  yield takeEvery(GO_BUTTON_IMPORT_FIELD_MAP_ADD, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_IMPORT_FIELD_MAP, Save_Method_ForExcel_ImportMaster_GenFun)
}

export default ImportExcelFieldMap_Saga;