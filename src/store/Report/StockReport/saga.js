import { call, put, takeLatest } from "redux-saga/effects";
import { StockProcessing_API_Success, stockReportApiErrorAction, stockReport_1_GoButton_API_Success, stockReport_GoButton_API_Success } from "./action";
import { STOCK_PROCESSING_ACTION, STOCK_REPORT_1_GO_BUTTON_API, STOCK_REPORT_1_GO_BUTTON_API_SUCCESS, STOCK_REPORT_GO_BUTTON_API } from "./actionType";
import { StockProcessing_API, StockReport_1_GoBtn_API, StockReport_GoBtn_API } from "../../../helpers/backend_helper";

function* StockReport_GenFunc({ config }) {
    try {
        const response = yield call(StockReport_GoBtn_API, config);
        yield put(stockReport_GoButton_API_Success(response.Data))
    } catch (error) { yield put(stockReportApiErrorAction()) }
}

//*************** */ Stock Report 1 ***************************
function* StockProccessing_GenFunc({ config }) {
    try {
        const response = yield call(StockProcessing_API, config);
        yield put(StockProcessing_API_Success(response))
    } catch (error) { yield put(stockReportApiErrorAction()) }
}

function* StockReport_1_GenFunc({ config }) {

    try {
        const response = yield call(StockReport_1_GoBtn_API, config);
        yield put(stockReport_1_GoButton_API_Success(response))
    } catch (error) { yield put(stockReportApiErrorAction()) }
}

function* StockReportSaga() {
    yield takeLatest(STOCK_REPORT_GO_BUTTON_API, StockReport_GenFunc)
    yield takeLatest(STOCK_PROCESSING_ACTION, StockProccessing_GenFunc)
    yield takeLatest(STOCK_REPORT_1_GO_BUTTON_API, StockReport_1_GenFunc)

}

export default StockReportSaga;