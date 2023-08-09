import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_ORDER_SUMMARY_API,
} from "./actionType";
import { OrderSummaryApiErrorAction, postOrderSummary_API_Success } from "./action";
import { OderSummary_GoBtn_API } from "../../../helpers/backend_helper";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* OrderSummary_GenFunc({ config }) {

    try {
        const response = yield call(OderSummary_GoBtn_API, config);
        yield put(postOrderSummary_API_Success(response))
    } catch (error) {
        CommonConsole(error);
        yield put(OrderSummaryApiErrorAction());
    }
}

function* OrderSummarySaga() {
    yield takeLatest(POST_ORDER_SUMMARY_API, OrderSummary_GenFunc)
}

export default OrderSummarySaga;