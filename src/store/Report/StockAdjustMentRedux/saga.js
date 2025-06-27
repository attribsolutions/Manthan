import { call, put, takeLatest } from "redux-saga/effects";
import { STOCK_ADJUSTMENT_REPORT_ACTION, } from "./actionType";
import { Stock_adjustment_Report_ApiErrorAction, Stock_adjustment_Report_Success } from "./action";
import { Stock_Adjustment_Report_GoButton_API, } from "../../../helpers/backend_helper"

function* Stock_Adjustment_Report_GenFunc({ config }) {
    try {
        let response = yield call(Stock_Adjustment_Report_GoButton_API, config);
        debugger
        response.Type = config.btnId
        yield put(Stock_adjustment_Report_Success(response))
    } catch (error) { yield put(Stock_adjustment_Report_ApiErrorAction()) }
}
function* Stock_Adjustment_ReportSaga() {
    yield takeLatest(STOCK_ADJUSTMENT_REPORT_ACTION, Stock_Adjustment_Report_GenFunc)
}

export default Stock_Adjustment_ReportSaga;
