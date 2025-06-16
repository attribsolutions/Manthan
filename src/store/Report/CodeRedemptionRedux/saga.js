import { call, put, takeLatest } from "redux-saga/effects";
import { CODE_REDEMPTION_REPORT_ACTION } from "./actionType";
import { CodeRedemption_Report_Action_Success, CodeRedemption_Report_ErrorAction } from "./action";
import { CodeRedemptionReport_API, } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";


function* CodeRedemptionReport_GenFunc({ config }) {

	function formatDateRange(dateRange) {
		const [start, end] = dateRange.split(" To ");

		const formatDate = (dateStr) => {
			const [year, month, day] = dateStr.split("-");
			return `${day}-${month}-${year}`;
		};

		return `${formatDate(start)} To ${formatDate(end)}`;
	}
	try {
		let response = yield call(CodeRedemptionReport_API, config);
		response["Mode"] = config.Mode
		debugger
		response.Data = response.Data.map(item => ({
			...item,
			InvoiceDate: date_dmy_func(item.InvoiceDate),
			recordsAmountTotal: item.InvoiceAmount, // You can set the flag value as needed
			SchemePeriod: formatDateRange(item.SchemePeriod), // Format the date range
		}));
		yield put(CodeRedemption_Report_Action_Success(response))
	} catch (error) { yield put(CodeRedemption_Report_ErrorAction()) }
}

function* CodeRedemptionReportSaga() {
	yield takeLatest(CODE_REDEMPTION_REPORT_ACTION, CodeRedemptionReport_GenFunc)
}

export default CodeRedemptionReportSaga;
