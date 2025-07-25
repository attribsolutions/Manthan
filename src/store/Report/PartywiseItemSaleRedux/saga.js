import { call, put, takeLatest } from "redux-saga/effects";
import {  PartyWiseItemSaleReport_GoButton_API_Success, PartyWiseItemSaleReportApiErrorAction } from "./action";
import { PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API } from "./actionType";
import { ItemConsumption_API, PartyWiseItemSale_API } from "../../../helpers/backend_helper";



function* PartyWiseItemSaleReport_GenFunc({ config }) {
	
	try {
	
		let response = yield call(PartyWiseItemSale_API, config);

		response["goBtnMode"] = config.goBtnMode
		yield put(PartyWiseItemSaleReport_GoButton_API_Success(response))
	} catch (error) { yield put(PartyWiseItemSaleReportApiErrorAction()) }
	
}


function* PartyWiseItemSaleReportSaga() {
	yield takeLatest(PARTY_WISE_ITEM_SALE_REPORT_GO_BUTTON_API, PartyWiseItemSaleReport_GenFunc)
}

export default PartyWiseItemSaleReportSaga;
