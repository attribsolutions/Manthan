import { call, put, takeLatest } from "redux-saga/effects";
import { DEMANDVSSUPPLY_REPORT_ACTION } from "./actionType";
import { DemandVSSupply_Report_Action_Success, DemandVSSupply_Report_ErrorAction } from "./action";
import { DemandVsSupplyReport_API } from "../../../helpers/backend_helper";


function* DemandVsSupplyReport_GenFunc({ config }) {
	
	try {
		let response = yield call(DemandVsSupplyReport_API, config);
		response["Mode"] = config.Mode
		
		yield put(DemandVSSupply_Report_Action_Success(response))
	} catch (error) { yield put(DemandVSSupply_Report_ErrorAction()) }
}

function* DemandVsSupplyReportSaga() {
	yield takeLatest(DEMANDVSSUPPLY_REPORT_ACTION, DemandVsSupplyReport_GenFunc)
}

export default DemandVsSupplyReportSaga;
