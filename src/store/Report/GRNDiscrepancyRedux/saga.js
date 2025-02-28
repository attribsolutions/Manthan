import { call, put, takeLatest } from "redux-saga/effects";
import { GRN_DISCREPANCY_REPORT_ACTION } from "./actionType";
import { GRN_Discrepancy_Report_Action_Success, GRN_Discrepancy_Report_ErrorAction, Return_Report_Action_Success, Return_Report_ErrorAction } from "./action";
import { GRNDiscrepancyReport_API } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";


function* GRNDiscrepancyReport_GenFunc({ config }) {

	try {
		let response = yield call(GRNDiscrepancyReport_API, config);
		response["Mode"] = config.Mode
		response.Data.map((item, index) => {
			item["GRNSaveDate"] = date_dmy_func(item["GRNSaveDate"])
			item["InvoiceDate"] = date_dmy_func(item["InvoiceDate"])
			return item
		})
		yield put(GRN_Discrepancy_Report_Action_Success(response))
	} catch (error) { yield put(GRN_Discrepancy_Report_ErrorAction()) }
}

function* GRNDiscrepancyReportSaga() {
	yield takeLatest(GRN_DISCREPANCY_REPORT_ACTION, GRNDiscrepancyReport_GenFunc)
}

export default GRNDiscrepancyReportSaga;
