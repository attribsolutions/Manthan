import { call, put, takeEvery } from "redux-saga/effects";
import {
  GoButton_ImportMasterMap_Success,
  save_ImportMasterMap_Success
} from "./action";
import {
  ImportMaster_Map_Customer_GoButton_API,
  ImportMaster_Map_Customer_Save_API,
  ImportMaster_Map_Item_GoButton_API,
  ImportMaster_Map_Unit_GoButton_API,
} from "../../../helpers/backend_helper";
import {
  GO_BUTTON_IMPORT_MASTER_MAP,
  SAVE_IMPORT_MASTER_MAP,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* GoButtonExcel_ImportMaster_GenFun({ config }) {              // Go buuton add Page API

  const { mapType } = config

  let response = []
  try {
    if (mapType === 1) {
      response = yield call(ImportMaster_Map_Customer_GoButton_API, config);
    } else if (mapType === 2) {
      response = yield call(ImportMaster_Map_Item_GoButton_API, config);
    } else {
      response = yield call(ImportMaster_Map_Unit_GoButton_API, config);
    }
    yield put(GoButton_ImportMasterMap_Success(response.Data));

  } catch (error) { CommonConsole(error) }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {              // Save API
  try {
    const response = yield call(ImportMaster_Map_Customer_Save_API, config);
    yield put(save_ImportMasterMap_Success(response));
  } catch (error) { CommonConsole(error) }
}


function* ImportMasterMap_Saga() {
  yield takeEvery(GO_BUTTON_IMPORT_MASTER_MAP, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_IMPORT_MASTER_MAP, Save_Method_ForExcel_ImportMaster_GenFun)

}

export default ImportMasterMap_Saga;