import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_ORDER_SUMMARY_API,
} from "./actionType";
import { OrderSummaryApiErrorAction, postOrderSummary_API_Success } from "./action";
import { OderSummary_GoBtn_API } from "../../../helpers/backend_helper";

function* OrderSummary_GenFunc({ config }) {
    
    try {
        const response = yield call(OderSummary_GoBtn_API, config);
        response["btnId"] = config.btnId;
        yield put(postOrderSummary_API_Success(response))
    } catch (error) { yield put(OrderSummaryApiErrorAction()) }
}

function* OrderSummarySaga() {
    yield takeLatest(POST_ORDER_SUMMARY_API, OrderSummary_GenFunc)
}

export default OrderSummarySaga;