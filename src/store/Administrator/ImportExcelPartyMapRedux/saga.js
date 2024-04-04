import { call, put, takeEvery } from "redux-saga/effects";
import {
  InvoiceExcelUpload_save_Success,
  GoButton_ImportExcelPartyMap_Success,
  save_ImportExcelPartyMap_Sucess,
  PartyExcelUpload_save_Success,
  RetailerExcelUpload_save_action_Success,
  RetailerExcelUploadApiErrorAction
} from "./action";
import {
  CreditNote_ExcelUpload_Save_API,
  ExcelUpload_Invoice_Save_API,
  ExcelUpload_Retailer_Save_API,
  ImportMaster_Map_Customer_GoButton_API,
  ImportMaster_Map_Customer_Save_API,
  ImportMaster_Map_Item_GoButton_API,
  ImportMaster_Map_Item_Save_API,
  ImportMaster_Map_Unit_GoButton_API,
  ImportMaster_Map_Unit_Save_API,
} from "../../../helpers/backend_helper";
import {
  INVOICE_EXCEL_UPLOAD_SAVE,
  GO_BUTTON_IMPORT_EXCEL_PARTY_MAP,
  SAVE_IMPORT_EXCEL_PARTY_MAP,
  RETAILER_EXCEL_UPLOAD_SAVE,
} from "./actionType";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { url } from "../../../routes";


function* GoButtonExcel_ImportMaster_GenFun({ config }) {              // Go buuton add Page API

  const { mapType, partyId } = config

  try {

    let newResp = []
    if (mapType === 1) {
      const response = yield call(ImportMaster_Map_Customer_GoButton_API, config);

      newResp = response.Data.map(i => ({
        "id": i.id,
        "party": !(i.Party_id === null) ? i.Party_id : partyId,
        "fieldName": i.CustomerName,
        "CustomerAddress": i.CustomerAddress,
        "GSTIN": i.GSTIN,
        "RouteName": i.RouteName,
        "fieldId": i.Customer,
        "mapValue": i.MapCustomer,
      }))

    } else if (mapType === 3) {
      const response = yield call(ImportMaster_Map_Unit_GoButton_API, config);

      newResp = response.Data.map(i => ({
        "id": i.id,
        "party": !(i.Party_id === null) ? i.Party_id : partyId,
        "fieldName": i.Name,

        "fieldId": i.id,
        "mapValue": i.MapUnit,
      }))
    } else {
      const response = yield call(ImportMaster_Map_Customer_GoButton_API, config);
      newResp = response.Data
    }

    yield put(GoButton_ImportExcelPartyMap_Success(newResp));

  } catch (error) { yield put(RetailerExcelUploadApiErrorAction()) }
}

function* Save_Method_ForExcel_ImportMaster_GenFun({ config }) {  // Save API
  const { mapType } = config
  try {
    if (mapType === 1) {
      const response = yield call(ImportMaster_Map_Customer_Save_API, config);
      yield put(save_ImportExcelPartyMap_Sucess(response));
    }
    else if (mapType === 2) {
      const response = yield call(ImportMaster_Map_Item_Save_API, config);
      yield put(save_ImportExcelPartyMap_Sucess(response));
    }
    else {
      const response = yield call(ImportMaster_Map_Unit_Save_API, config);
      yield put(save_ImportExcelPartyMap_Sucess(response));
    }

  } catch (error) { yield put(RetailerExcelUploadApiErrorAction()) }
}

function* InvoiceExcelUpload_save_GenFun({ config }) {  // Save API

  try {
    let response
    if (config.subPageMode === url.CREDIT_NOTE_UPLOAD) {
      response = yield call(CreditNote_ExcelUpload_Save_API, config);
    }
    else {
      response = yield call(ExcelUpload_Invoice_Save_API, config);
    }
    yield put(InvoiceExcelUpload_save_Success(response));

  } catch (error) { yield put(RetailerExcelUploadApiErrorAction()) }
}

function* RetailerExcelUpload_save_GenFun({ config }) {  // Save API

  try {
    const response = yield call(ExcelUpload_Retailer_Save_API, config);
    yield put(RetailerExcelUpload_save_action_Success(response));

  } catch (error) { yield put(RetailerExcelUploadApiErrorAction()) }
}

function* ImportExcelPartyMap_Saga() {
  yield takeEvery(GO_BUTTON_IMPORT_EXCEL_PARTY_MAP, GoButtonExcel_ImportMaster_GenFun)
  yield takeEvery(SAVE_IMPORT_EXCEL_PARTY_MAP, Save_Method_ForExcel_ImportMaster_GenFun)
  yield takeEvery(INVOICE_EXCEL_UPLOAD_SAVE, InvoiceExcelUpload_save_GenFun)
  yield takeEvery(RETAILER_EXCEL_UPLOAD_SAVE, RetailerExcelUpload_save_GenFun)
}

export default ImportExcelPartyMap_Saga;