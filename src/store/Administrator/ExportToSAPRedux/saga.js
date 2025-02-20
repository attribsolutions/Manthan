import { call, put, takeLatest } from "redux-saga/effects";
import { DATA_EXPORT_TO_SAP_ACTION, FETCH_UPLOADED_FILE_ACTION } from "./actionType";
import { DataExportTo_SAP_Action_ErrorAction, DataExportTo_SAP_Action_Success, Fetch_UploadFile_Action_Success } from "./action";
import { DataExportToSAP_API, DataExportToSAP_Get_API, ReturnReport_API } from "../../../helpers/backend_helper";


function* DataExportTOSap_GenFunc({ config }) {
	try {
		const response = yield call(DataExportToSAP_API, config);

		yield put(DataExportTo_SAP_Action_Success(response))
	} catch (error) { yield put(DataExportTo_SAP_Action_ErrorAction()) }
}


function* FetchUploadedFile_GenFunc({ config }) {
	try {
		const response = yield call(DataExportToSAP_Get_API, config);
		yield put(Fetch_UploadFile_Action_Success(response.Data))
	} catch (error) { yield put(DataExportTo_SAP_Action_ErrorAction()) }
}


function* DataExportToSapSaga() {
	yield takeLatest(DATA_EXPORT_TO_SAP_ACTION, DataExportTOSap_GenFunc)
	yield takeLatest(FETCH_UPLOADED_FILE_ACTION, FetchUploadedFile_GenFunc)


}

export default DataExportToSapSaga;
