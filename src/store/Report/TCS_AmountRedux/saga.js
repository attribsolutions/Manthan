import { call, put, takeLatest } from "redux-saga/effects";
import { TCS_AMOUNT_GO_BUTTON_ACTION } from "./actionType";
import { amountCommaSeparateFunc, date_dmy_func } from "../../../components/Common/CommonFunction";
import { TCS_Amount_Gobtn_Success, TCS_Amount_ReportApiErrorAction } from "./action";
import {TCS_Amount_Report_GoButton_API} from "../../../helpers/backend_helper"

function* TCSAmountReport_GenFunc({ config }) {

	try {
		const response = yield call(TCS_Amount_Report_GoButton_API, config);

		response.Data.map((i) => {
			i["InvoiceDate"] = date_dmy_func(i.InvoiceDate);
			i.GrandTotal = amountCommaSeparateFunc(parseFloat(i.GrandTotal).toFixed(2)) //  GrandTotal show with commas
			i.TCSTaxAmount = amountCommaSeparateFunc(parseFloat(i.TCSTaxAmount).toFixed(2)) //  GrandTotal show with commas
			i.Total = amountCommaSeparateFunc(parseFloat(i.Total).toFixed(2)) //  GrandTotal show with commas
			return i;
		});

		yield put(TCS_Amount_Gobtn_Success(response.Data))
	} catch (error) { yield put(TCS_Amount_ReportApiErrorAction()) }
}

function* TCSAmountReportSaga() {
	yield takeLatest(TCS_AMOUNT_GO_BUTTON_ACTION, TCSAmountReport_GenFunc)
}

export default TCSAmountReportSaga;
