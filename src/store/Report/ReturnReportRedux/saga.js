import { call, put, takeLatest } from "redux-saga/effects";
import {  RETURN_REPORT_ACTION } from "./actionType";
import {  Return_Report_Action_Success } from "./action";
import { GenericSale_GoBtn_API } from "../../../helpers/backend_helper";
import { CommonConsole } from "../../../components/Common/CommonFunction";

function* ReturnReport_GenFunc({ config }) {

    try {
        const response = yield call(GenericSale_GoBtn_API, config);
        yield put(Return_Report_Action_Success(response))
    } catch (error) { CommonConsole(error) }
}

function* ReturnReportSaga() {
    yield takeLatest(RETURN_REPORT_ACTION, ReturnReport_GenFunc)
}

export default ReturnReportSaga;