import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_PURCHASE_GST_REPORT_API,
} from "./actionType";
import { postPurchaseGSTReport_API_Success, postPurchaseGSTReportApiErrorAction, postRetailerData_API_Success, RetailerDataApiErrorAction } from "./action";
import { PurchaseGSTReportSaga_GoBtn_API } from "../../../helpers/backend_helper";

function* PurchaseGSTReport_Gen({ config }) {

    try {
        const response = yield call(PurchaseGSTReportSaga_GoBtn_API, config);
        response.Data["Type"] = config.Type;
        yield put(postPurchaseGSTReport_API_Success(response.Data))
    } catch (error) { yield put(postPurchaseGSTReportApiErrorAction()) }
}

function* PurchaseGSTReportSaga() {
    yield takeLatest(POST_PURCHASE_GST_REPORT_API, PurchaseGSTReport_Gen)
}

export default PurchaseGSTReportSaga;