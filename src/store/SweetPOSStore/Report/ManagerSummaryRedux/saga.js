import { call, put, takeLatest } from "redux-saga/effects";
import { ManagerSummaryReport_GoButton_API_Success, ManagerSummaryApiErrorAction } from "./action";
import { MANAGER_SUMMARY_REPORT_GO_BUTTON_API } from "./actionType";
import { ManagerSummary_API } from "../../../../helpers/backend_helper";
import { date_dmy_func } from "../../../../components/Common/CommonFunction";


function* ManagerSummaryReport_GenFunc({ config }) {
	try {

		let response = yield call(ManagerSummary_API, config);
		const newList = yield response.Data.map((i) => {
			i["recordsAmountTotal"] = i.Amount;  // Breadcrumb Count total
			i.InvoiceDate = date_dmy_func(i.InvoiceDate); // Only for Dashoard 
			return i
		})
		response["Data"] = newList
		response["goBtnMode"] = config.goBtnMode
		yield put(ManagerSummaryReport_GoButton_API_Success(response))
	} catch (error) { yield put(ManagerSummaryApiErrorAction()) }
}

function* ManagerSummaryReportSaga() {
	yield takeLatest(MANAGER_SUMMARY_REPORT_GO_BUTTON_API, ManagerSummaryReport_GenFunc)
}

export default ManagerSummaryReportSaga;
