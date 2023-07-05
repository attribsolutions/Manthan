import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PDF_MULTIPLEINVOICE_DATA, GET_PDF_REPORT_DATA } from "./actionType";
// import { Data } from "./DemoData";

import { getpdfReportdataError, getpdfReportdataSuccess, } from "./actions";
import { get_Group_List_Api } from "../../../helpers/backend_helper";
import { CommonConsole } from "../../../components/Common/CommonFunction";
import { dataGenrator } from "../../../Reports/Invoice report a5/DemoData";


function* getpdfData_GenFunc({ urlpath, ReportType, Id, Partysettingdata }) {

  try {
    
    const response = yield call(urlpath, Id);
    response["ReportType"] = ReportType
    response.Data["ReportType"] = ReportType
    response.Data["SettingData"] = Partysettingdata;

    yield put(getpdfReportdataSuccess(response));

  } catch (error) {
    yield put(getpdfReportdataError())
    CommonConsole(error)
  }
}

function* GetMultipleinvoicereport_GenFunc({ API, jsonBody, ReportType, Id }) {

  try {

    // const response = yield call(MultipleInvoice_API, jsonBody);
    const response = yield call(get_Group_List_Api, jsonBody);
    // const response = Data;
    response["ReportType"] = ReportType
    response.Data["ReportType"] = ReportType
    response["Data"] = dataGenrator()
    // yield put((response));
    yield put(getpdfReportdataSuccess(response));


  } catch (error) {
    yield put(getpdfReportdataError())
    CommonConsole(error)
  }
}

function* pdfReport_Saga() {
  yield takeEvery(GET_PDF_REPORT_DATA, getpdfData_GenFunc);
  yield takeEvery(GET_PDF_MULTIPLEINVOICE_DATA, GetMultipleinvoicereport_GenFunc);

}
export default pdfReport_Saga;
