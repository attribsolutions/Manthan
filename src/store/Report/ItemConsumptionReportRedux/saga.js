import { call, put, takeLatest } from "redux-saga/effects";
import { ItemConsumptionReport_GoButton_API_Success, ItemConsumptionApiErrorAction } from "./action";
import { ITEM_CONSUMPTION_REPORT_GO_BUTTON_API } from "./actionType";
import { ItemConsumption_API } from "../../../helpers/backend_helper";



function* ItemConsumptionReport_GenFunc({ config }) {
	
	try {
	
		let response = yield call(ItemConsumption_API, config);

		response["goBtnMode"] = config.goBtnMode
		yield put(ItemConsumptionReport_GoButton_API_Success(response))
	} catch (error) { yield put(ItemConsumptionApiErrorAction()) }
	
}


function* ItemConsumptionReportSaga() {
	yield takeLatest(ITEM_CONSUMPTION_REPORT_GO_BUTTON_API, ItemConsumptionReport_GenFunc)
}

export default ItemConsumptionReportSaga;
