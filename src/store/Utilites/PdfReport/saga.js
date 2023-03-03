import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PDF_REPORT_DATA } from "./actionType";

import {
  SpinnerState,
} from "../../actions"
import { getpdfReportdataSuccess } from "./actions";


function* getpdfData_GenFunc({ urlpath = () => { }, ReportType, Id }) {

  try {
    debugger
    const response = yield call(urlpath, Id);
    response["ReportType"] = ReportType
    response.Data["ReportType"] = ReportType
    yield put(getpdfReportdataSuccess(response));
   
  } catch (error) {
   

  }
}

function* pdfReport_Saga() {
  yield takeEvery(GET_PDF_REPORT_DATA, getpdfData_GenFunc);
}
export default pdfReport_Saga;
