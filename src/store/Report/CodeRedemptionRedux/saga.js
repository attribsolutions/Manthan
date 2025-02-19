import { call, put, takeLatest } from "redux-saga/effects";
import { CODE_REDEMPTION_REPORT_ACTION } from "./actionType";
import { CodeRedemption_Report_Action_Success, CodeRedemption_Report_ErrorAction } from "./action";
import { CodeRedemptionReport_API, } from "../../../helpers/backend_helper";


function* CodeRedemptionReport_GenFunc({ config }) {

	try {
		let response = yield call(CodeRedemptionReport_API, config);
		response["Mode"] = config.Mode
		yield put(CodeRedemption_Report_Action_Success(response))
	} catch (error) { yield put(CodeRedemption_Report_ErrorAction()) }
}

function* CodeRedemptionReportSaga() {
	yield takeLatest(CODE_REDEMPTION_REPORT_ACTION, CodeRedemptionReport_GenFunc)
}

export default CodeRedemptionReportSaga;
