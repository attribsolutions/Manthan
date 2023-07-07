import { call, put, takeEvery } from "redux-saga/effects";
import { stockReportApiErrorAction, stockReport_GoButton_API_Success } from "./action";
import { STOCK_REPORT_GO_BUTTON_API } from "./actionType";
import { StockReport_GoBtn_API } from "../../../helpers/backend_helper";

function* StockReport_GenFunc({ config }) {
    try {
        const response = yield call(StockReport_GoBtn_API, config);
        yield put(stockReport_GoButton_API_Success(response.Data))
    } catch (error) { yield put(stockReportApiErrorAction()) }
}

function* StockReportSaga() {
    yield takeEvery(STOCK_REPORT_GO_BUTTON_API, StockReport_GenFunc)
}

export default StockReportSaga;