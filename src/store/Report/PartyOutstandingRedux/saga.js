import { call, put, takeLatest } from "redux-saga/effects";
import { PartyOutstandingReport_GoButton_API_Success, PartyOutstanding_Api_ErrorAction } from "./action";
import { PARTY_OUTSTANDING_REPORT_GO_BUTTON_API } from "./actionType";
import { OutStandingBalance_GoBtn_API } from "../../../helpers/backend_helper";
import { roundToDecimalPlaces } from "../../../components/Common/CommonFunction";

function* PartyOutstanding_Report_GenFunc({ config }) {

	try {
		const response = yield call(OutStandingBalance_GoBtn_API, config);
		const updatedData = response.Data.map((i, index) => {
			i["OutStandingBalance"] = roundToDecimalPlaces(i.OutStandingBalance, 2);
			i["recordsAmountTotal"] = roundToDecimalPlaces(i.OutStandingBalance, 2);  // Breadcrumb Count total
			i["id"] = index + 1
			return i
		})
		yield put(PartyOutstandingReport_GoButton_API_Success(updatedData))
	} catch (error) { yield put(PartyOutstanding_Api_ErrorAction()) }
}

function* PartyOutstanding_Saga() {
	yield takeLatest(PARTY_OUTSTANDING_REPORT_GO_BUTTON_API, PartyOutstanding_Report_GenFunc)
}

export default PartyOutstanding_Saga;
