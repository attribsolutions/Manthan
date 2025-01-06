import { call, put, takeLatest } from "redux-saga/effects";
import { BILLBOOKING_REPORT_ACTION, } from "./actionType";
import { BillBooking_Report_Action_Success, BillBooking_Report_ErrorAction } from "./action";
import { Bill_booking_Report_Api, } from "../../../helpers/backend_helper";

function* BillBookingReport_GenFunc({ config }) {

	try {
		const response = yield call(Bill_booking_Report_Api, config);
		yield put(BillBooking_Report_Action_Success(response))
	} catch (error) { yield put(BillBooking_Report_ErrorAction()) }
}

function* BillBookingReportSaga() {
	yield takeLatest(BILLBOOKING_REPORT_ACTION, BillBookingReport_GenFunc)
}

export default BillBookingReportSaga;
