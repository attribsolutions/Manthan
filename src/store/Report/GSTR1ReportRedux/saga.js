import { call, put, takeLatest } from "redux-saga/effects";
import {
    GST_3B_REPORT_API,
    GST_R1_REPORT_API,
    GST_R3B_REPORT_API,
} from "./actionType";
import {
    GST_R1_Report_API_ErrorAction,
    GST_R1_Report_API_Success,
    GST_R3B_Report_API_Success,
} from "./action";
import { Gst_R1_Report_API, Gst_R3B_Report_API, } from "../../../helpers/backend_helper";
function* GstR1Report_Gen({ config }) {
    try {
        const response = yield call(Gst_R1_Report_API, config);
        
        yield put(GST_R1_Report_API_Success(response))
    } catch (error) { yield put(GST_R1_Report_API_ErrorAction()) }
}

function* GstR3BReport_Gen({ config }) {
    try {
        const response = yield call(Gst_R3B_Report_API, config);
        
        yield put(GST_R3B_Report_API_Success(response))
    } catch (error) { yield put(GST_R1_Report_API_ErrorAction()) }
}

function* GstR1ReportSaga() {
    yield takeLatest(GST_R3B_REPORT_API, GstR3BReport_Gen)
    yield takeLatest(GST_R1_REPORT_API, GstR1Report_Gen)



}

export default GstR1ReportSaga;