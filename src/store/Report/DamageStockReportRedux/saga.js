import { call, put, takeLatest } from "redux-saga/effects";
import { stockReportApiErrorAction, damageStockReport_GoButton_API_Success } from "./action";
import { DAMAGE_STOCK_REPORT_GO_BUTTON_API } from "./actionType";
import { DamageStockReport_GoBtn_API, OutStandingBalance_GoBtn_API } from "../../../helpers/backend_helper";
import { url } from "../../../routes";

function* damageStockReport_GenFunc({ config }) {

	const { subPageMode } = config
	try {
		let response

		if (subPageMode === url.PARTY_OUTSTANDING_REPORT) {
			response = yield call(OutStandingBalance_GoBtn_API, config);
		}
		else {
			response = yield call(DamageStockReport_GoBtn_API, config);
		}
		yield put(damageStockReport_GoButton_API_Success(response))
	} catch (error) { yield put(stockReportApiErrorAction()) }
}

function* DamageStockReportSaga() {
	yield takeLatest(DAMAGE_STOCK_REPORT_GO_BUTTON_API, damageStockReport_GenFunc)
}

export default DamageStockReportSaga;
