import { call, put, takeEvery } from "redux-saga/effects";
import {
  GoButton_ImportMasterMap_Success,
  save_ImportMasterMap_Success
} from "./action";
import {
  ImportMaster_Map_Customer_GoButton_API,
  ImportMaster_Map_Customer_Save_API,
  ImportMaster_Map_Item_GoButton_API,
  ImportMaster_Map_Item_Save_API,
  ImportMaster_Map_Unit_GoButton_API,
  ImportMaster_Map_Unit_Save_API,
} from "../../../helpers/backend_helper";
import {
  GO_BUTTON_IMPORT_MASTER_MAP,
  SAVE_IMPORT_MASTER_MAP,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";


function* GoButtonExcel_ImportMaster_GenFun({ config }) {              // Go buuton add Page API

  const { mapType,partyId } = config

  try {
    let newResp = []
    if (mapType === 1) {
      const response = yield call(ImportMaster_Map_Customer_GoButton_API, config);
      newResp = response.Data.map(i => ({
        "id": i.id,
        "party": !(i.Party_id===null)?i.Party_id:partyId,
        "fieldName": i.CustomerName,
        "fieldId": i.Customer,
        "mapValue": i.MapCustomer,
      }))

    } else if (mapType === 2) {
      const response = yield call(ImportMaster_Map_Item_GoButton_API, config);
      newResp = response.Data.map(i => ({
        "id": i.id,
        "party": !(i.Party_id===null)?i.Party_id:partyId,
        "fieldName": i.Name,
        "fieldId": i.Item_id,
        "mapValue": i.MapItem,
      }))
    } else {
      const response = yield call(ImportMaster_Map_Unit_GoButton_API, config);
    
      newResp = response.Data.map(i => ({
        "id": i.id,
        "party": !(i.Party_id===null)?i.Party_id:partyId,
        "fieldName": i.Name,
        "fieldId": i.id,
        "mapValue": i.MapUnit,
      }))
    }

    yield put(GoButton_ImportMasterMap_Success(newResp));

  } catch (error) { CommonConsole(error) }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {  // Save API
  const { mapType } = config
  try {
    if (mapType === 1) {
      const response = yield call(ImportMaster_Map_Customer_Save_API, config);
      yield put(save_ImportMasterMap_Success(response));
    }
    else if (mapType === 2) {
      const response = yield call(ImportMaster_Map_Item_Save_API, config);
      yield put(save_ImportMasterMap_Success(response));
    }
    else {
      const response = yield call(ImportMaster_Map_Unit_Save_API, config);
      yield put(save_ImportMasterMap_Success(response));
    }

  } catch (error) { CommonConsole(error) }
}


function* ImportMasterMap_Saga() {
  yield takeEvery(GO_BUTTON_IMPORT_MASTER_MAP, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_IMPORT_MASTER_MAP, Save_Method_ForExcel_ImportMaster_GenFun)

}

export default ImportMasterMap_Saga;