import { call, put, takeLatest } from "redux-saga/effects";
import { Periodic_GRN_Report_ErrorAction, Periodic_GRN_Report_Success } from "./action";
import { PERIODIC_GRN_REPORT } from "./actionType";
import { Periodic_Grn_Report_Api } from "../../../helpers/backend_helper";
function* PeriodicGrnReport_GenFunc({ config }) {
	try {
		let response = yield call(Periodic_Grn_Report_Api, config);
		response["BtnMode"] = config.BtnMode
		yield put(Periodic_GRN_Report_Success(response))
	} catch (error) { yield put(Periodic_GRN_Report_ErrorAction()) }
}

function* PeriodicGRNReportSaga() {
	yield takeLatest(PERIODIC_GRN_REPORT, PeriodicGrnReport_GenFunc)
}

export default PeriodicGRNReportSaga;
