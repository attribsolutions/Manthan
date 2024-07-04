import { call, put, takeLatest } from "redux-saga/effects";
import { CashierSummaryReport_GoButton_API_Success, CashierSummaryApiErrorAction } from "./action";
import { CASHIER_SUMMARY_REPORT_GO_BUTTON_API } from "./actionType";
import { CashierSummary_API } from "../../../../helpers/backend_helper";


function* CashierSummaryReport_GenFunc({ config }) {
	try {
		const response = yield call(CashierSummary_API, config);
		yield put(CashierSummaryReport_GoButton_API_Success(response))
	} catch (error) { yield put(CashierSummaryApiErrorAction()) }
}

function* CashierSummaryReportSaga() {
	yield takeLatest(CASHIER_SUMMARY_REPORT_GO_BUTTON_API, CashierSummaryReport_GenFunc)
}

export default CashierSummaryReportSaga;
