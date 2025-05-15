import { call, put, takeLatest } from "redux-saga/effects";
import { date_dmy_func } from "../../../../components/Common/CommonFunction";
import { BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API } from "./actionType";
import { BillDelete_API } from "../../../../helpers/backend_helper";
import { BillDeleteSummaryApiErrorAction, BillDeleteSummaryReport_GoButton_API_Success } from "./action";



function* BillDeleteSummaryReport_GenFunc({ config }) {

	try {

		let response = yield call(BillDelete_API, config);
		const UpdatedData = yield response.Data.map((i) => {
			i["recordsAmountTotal"] = i.GrandTotal;  // Breadcrumb Count total
			i.InvoiceDate = date_dmy_func(i.InvoiceDate); // Only for Dashoard 
			return i
		})
		response["goBtnMode"] = config.goBtnMode
		response["Data"] = UpdatedData
		yield put(BillDeleteSummaryReport_GoButton_API_Success(response))
	} catch (error) { yield put(BillDeleteSummaryApiErrorAction()) }
}

function* BillDeleteSummaryReportSaga() {
	yield takeLatest(BILL_DELETE_SUMMARY_REPORT_GO_BUTTON_API, BillDeleteSummaryReport_GenFunc)
}

export default BillDeleteSummaryReportSaga;
