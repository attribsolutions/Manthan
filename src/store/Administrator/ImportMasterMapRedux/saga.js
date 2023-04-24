import { call, put, takeEvery } from "redux-saga/effects";
import {
  GoButton_ImportMasterMap_Success,
  save_ImportMasterMap_Success
} from "./action";
import {
  ImportMaster_Map_GoButton_API,
  ImportMaster_Map_Save_API,
} from "../../../helpers/backend_helper";
import {
  GO_BUTTON_IMPORT_MASTER_MAP_ADD,
  SAVE_IMPORT_MASTER_MAP,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* GoButtonExcel_ImportMaster_GenFun({ config }) {              // Go buuton add Page API
  try {
    const response = yield call(ImportMaster_Map_GoButton_API, config);
    yield put(GoButton_ImportMasterMap_Success(response.Data));
  } catch (error) { CommonConsole(error) }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ImportMaster_Map_Save_API, config);
    yield put(save_ImportMasterMap_Success(response));
  } catch (error) { CommonConsole(error) }
}


function* ImportMasterMap_Saga() {
  yield takeEvery(GO_BUTTON_IMPORT_MASTER_MAP_ADD, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_IMPORT_MASTER_MAP, Save_Method_ForExcel_ImportMaster_GenFun)
  
}

export default ImportMasterMap_Saga;