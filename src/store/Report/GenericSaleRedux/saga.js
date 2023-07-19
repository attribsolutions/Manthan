import { call, put, takeLatest } from "redux-saga/effects";
import { GO_BUTTON_FOR_GENERIC_SALE_ACTION } from "./actionType";
import { GenericSaleReportApiErrorAction, GoButton_For_GenericSale_Success } from "./action";
import { GenericSale_GoBtn_API } from "../../../helpers/backend_helper";

function* GenericSaleReport_GenFunc({ config }) {
    try {
        const response = yield call(GenericSale_GoBtn_API, config);
        yield put(GoButton_For_GenericSale_Success(response))
    } catch (error) { yield put(GenericSaleReportApiErrorAction()) }
}

function* GenericSaleReportSaga() {
    yield takeLatest(GO_BUTTON_FOR_GENERIC_SALE_ACTION, GenericSaleReport_GenFunc)
}

export default GenericSaleReportSaga;