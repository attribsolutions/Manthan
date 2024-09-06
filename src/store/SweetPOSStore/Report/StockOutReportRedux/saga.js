import { call, put, takeLatest } from "redux-saga/effects";
import { GO_BUTTON_FOR_STOCK_OUT_ACTION } from "./actionType";
import { GoButton_For_StockOut_Success, StockOut_Report_ErrorAction } from "./action";
import { StockOutReport_API } from "../../../../helpers/backend_helper";


function* StockOutReport_GenFunc({ config }) {

    try {
        const response = yield call(StockOutReport_API, config);
        yield put(GoButton_For_StockOut_Success(response))
    } catch (error) { yield put(StockOut_Report_ErrorAction()) }
}

function* StockOutReportSaga() {
    yield takeLatest(GO_BUTTON_FOR_STOCK_OUT_ACTION, StockOutReport_GenFunc)
}

export default StockOutReportSaga