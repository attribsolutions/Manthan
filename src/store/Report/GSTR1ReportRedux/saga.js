import { call, put, takeLatest } from "redux-saga/effects";
import {
    GST_R1_REPORT_API,
} from "./actionType";
import {
    GST_R1_Report_API_ErrorAction,
    GST_R1_Report_API_Success,
} from "./action";
import { Gst_R1_Report_API, } from "../../../helpers/backend_helper";
function* GstR1Report_Gen({ config }) {
    try {
        const response = yield call(Gst_R1_Report_API, config);
        debugger
        yield put(GST_R1_Report_API_Success(response))
    } catch (error) { yield put(GST_R1_Report_API_ErrorAction()) }
}

function* GstR1ReportSaga() {
    yield takeLatest(GST_R1_REPORT_API, GstR1Report_Gen)
}

export default GstR1ReportSaga;