import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PDF_MULTIPLEINVOICE_DATA, GET_PDF_REPORT_DATA } from "./actionType";
import { Data } from "./DemoData";

import { getpdfReportdataSuccess, postpdfMultipleReportdataSuccess } from "./actions";
import { MultipleInvoice_API } from "../../../helpers/backend_helper";
import { CommonConsole } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons";


function* getpdfData_GenFunc({ urlpath = () => { }, ReportType, Id }) {
  try {
    const response = yield call(urlpath, Id);
    response["ReportType"] = ReportType
    response.Data["ReportType"] = ReportType
    yield put(getpdfReportdataSuccess(response));

  } catch (error) {
   CommonConsole(error)
  }
}

function* GetMultipleinvoicereport_GenFunc({ API, jsonBody,ReportType, Id}) {
  debugger
  try {
    const response = yield call(MultipleInvoice_API, jsonBody);
    // const response = Data;

    response["ReportType"] = ReportType
    response.Data["ReportType"] = ReportType
    // response["Data"] = demodata.Data
    // yield put((response));
    yield put(getpdfReportdataSuccess(response));


  } catch (error) {
    CommonConsole(error)
  }
}

function* pdfReport_Saga() {
  yield takeEvery(GET_PDF_REPORT_DATA, getpdfData_GenFunc);
  yield takeEvery(GET_PDF_MULTIPLEINVOICE_DATA, GetMultipleinvoicereport_GenFunc);

}
export default pdfReport_Saga;
