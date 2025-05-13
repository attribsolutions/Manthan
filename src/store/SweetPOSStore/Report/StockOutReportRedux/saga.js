import { call, put, takeLatest } from "redux-saga/effects";
import { GO_BUTTON_FOR_STOCK_OUT_ACTION } from "./actionType";
import { GoButton_For_StockOut_Success, StockOut_Report_ErrorAction } from "./action";
import { StockOutReport_API } from "../../../../helpers/backend_helper";

//  Generator function
function* StockOutReport_GenFunc({ config }) {
    try {
        //  START SPINNER
        yield put({ type: "STOCKOUT_REPORT_LOADING", payload: true });

        //  API CALL
        let response = yield call(StockOutReport_API, config);
        response["Btnmode"] = config.Btnmode;

        //  DISPATCH SUCCESS
        yield put(GoButton_For_StockOut_Success(response));
    } catch (error) {
        //  DISPATCH ERROR
        yield put(StockOut_Report_ErrorAction());
    }
}

//  Saga Watcher
function* StockOutReportSaga() {
    yield takeLatest(GO_BUTTON_FOR_STOCK_OUT_ACTION, StockOutReport_GenFunc);
}

export default StockOutReportSaga;
