import { call, put, takeLatest } from "redux-saga/effects";
import { ManagerSummaryReport_GoButton_API_Success, ManagerSummaryApiErrorAction } from "./action";
import { MANAGER_SUMMARY_REPORT_GO_BUTTON_API } from "./actionType";
import { ManagerSummary_API } from "../../../../helpers/backend_helper";
import { date_dmy_func, getFixedNumber } from "../../../../components/Common/CommonFunction";


function* ManagerSummaryReport_GenFunc({ config }) {
	try {
		let OrderData = []
		let InvoiceData = []
		let response = yield call(ManagerSummary_API, config);

		let finalOrderAmount = 0
		let finalOrderAdvanceAmount = 0
		let finalInvoiceAdvanceAmount = 0
		let finalInvoiceAmount = 0
		let GrandOrderTotal = 0
		let GrandInvoiceTotal = 0

		OrderData = yield response.Data[0].OrderData.map((element) => {
			finalOrderAmount += getFixedNumber(element.OrderAmount, 2);
			finalOrderAdvanceAmount += getFixedNumber(element.AdvanceAmount, 2);
			element["TotalAmount"] = getFixedNumber(element.OrderAmount, 2) + getFixedNumber(element.AdvanceAmount, 2);
			GrandOrderTotal += getFixedNumber(element.TotalAmount, 2)
			return element
		})

		InvoiceData = yield response.Data[0].InvoiceData.map((element) => {
			finalInvoiceAmount += getFixedNumber(element.GrandTotal, 2);
			finalInvoiceAdvanceAmount += getFixedNumber(element.AdvanceAmount, 2);
			element["TotalAmount"] = getFixedNumber(element.GrandTotal, 2) + getFixedNumber(element.AdvanceAmount, 2);
			GrandInvoiceTotal += getFixedNumber(element.TotalAmount, 2)
			return element
		})

		OrderData.push({
			id: OrderData.length - 1,
			FullOrderNumber: "Total",
			AdvanceAmount: (finalOrderAdvanceAmount).toFixed(2),
			OrderAmount: (finalOrderAmount).toFixed(2),
			TotalAmount: (GrandOrderTotal).toFixed(2)
		})

		InvoiceData.push({
			id: InvoiceData.length - 1,
			FullInvoiceNumber: "Total",
			GrandTotal: (finalInvoiceAmount).toFixed(2),
			AdvanceAmount: (finalInvoiceAdvanceAmount).toFixed(2),
			TotalAmount:	(GrandInvoiceTotal).toFixed(2)
		})

		response["Data"] = [{ OrderData, InvoiceData }]
		debugger
		response["goBtnMode"] = config.goBtnMode
		yield put(ManagerSummaryReport_GoButton_API_Success(response))
	} catch (error) { yield put(ManagerSummaryApiErrorAction()) }
}

function* ManagerSummaryReportSaga() {
	yield takeLatest(MANAGER_SUMMARY_REPORT_GO_BUTTON_API, ManagerSummaryReport_GenFunc)
}

export default ManagerSummaryReportSaga;
