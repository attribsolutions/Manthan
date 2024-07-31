import { call, put, takeLatest } from "redux-saga/effects";
import { CashierSummaryReport_GoButton_API_Success, CashierSummaryApiErrorAction } from "./action";
import { CASHIER_SUMMARY_REPORT_GO_BUTTON_API } from "./actionType";
import { CashierSummary_API } from "../../../../helpers/backend_helper";
import { date_dmy_func } from "../../../../components/Common/CommonFunction";


function* CashierSummaryReport_GenFunc({ config }) {
	try {
		
		const response = yield call(CashierSummary_API, config);
		const newList = yield response.Data.map((i) => {

			i["recordsAmountTotal"] = i.Amount;  // Breadcrumb Count total
			i.InvoiceDate = date_dmy_func(i.InvoiceDate); // Only for Dashoard 
			return i
		})
		yield put(CashierSummaryReport_GoButton_API_Success(newList))
	} catch (error) { yield put(CashierSummaryApiErrorAction()) }
}

function* CashierSummaryReportSaga() {
	yield takeLatest(CASHIER_SUMMARY_REPORT_GO_BUTTON_API, CashierSummaryReport_GenFunc)
}

export default CashierSummaryReportSaga;
