import { call, put, takeLatest } from "redux-saga/effects";
import { ItemConsumptionReport_GoButton_API_Success, ItemConsumptionApiErrorAction } from "./action";
import { ITEM_CONSUMPTION_REPORT_GO_BUTTON_API } from "./actionType";
import { ItemConsumption_API } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";


function* ItemConsumptionReport_GenFunc({ config }) {
	try {

		let response = yield call(ItemConsumption_API, config);
		const newList = yield response.Data.map((i) => {
			i["recordsAmountTotal"] = i.Amount;  // Breadcrumb Count total
			i.InvoiceDate = date_dmy_func(i.InvoiceDate); // Only for Dashoard 
			return i
		})
		response["Data"] = newList
		response["goBtnMode"] = config.goBtnMode
		yield put(ItemConsumptionReport_GoButton_API_Success(response))
	} catch (error) { yield put(ItemConsumptionApiErrorAction()) }
}

function* ItemConsumptionReportSaga() {
	yield takeLatest(ITEM_CONSUMPTION_REPORT_GO_BUTTON_API, ItemConsumptionReport_GenFunc)
}

export default ItemConsumptionReportSaga;
