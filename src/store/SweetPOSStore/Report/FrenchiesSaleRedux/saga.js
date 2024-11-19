import { call, put, takeLatest } from "redux-saga/effects";
import { FRENCHISES_ITEM_SALE_REPORT_ACTION } from "./actionType";
import { Frenchies_Item_sale_Report_Action_Success, Frenchies_Item_sale_Report_ErrorAction } from "./action";
import { Frenchies_Item_sale_Report_API } from "../../../../helpers/backend_helper";

function* FrenchiesItemSaleReport_GenFunc({ config }) {

	try {
		const response = yield call(Frenchies_Item_sale_Report_API, config);
		response.Data.forEach(i => {
			i.recordsAmountTotal = i.Amount
			return i
		});
		yield put(Frenchies_Item_sale_Report_Action_Success(response))
	} catch (error) { yield put(Frenchies_Item_sale_Report_ErrorAction()) }
}

function* FrenchiesItemSaleReportSaga() {
	yield takeLatest(FRENCHISES_ITEM_SALE_REPORT_ACTION, FrenchiesItemSaleReport_GenFunc)
}

export default FrenchiesItemSaleReportSaga;
