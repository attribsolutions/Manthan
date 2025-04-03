import { call, put, takeLatest } from "redux-saga/effects";
import { GET_PDF_REPORT_DATA } from "./actionType";

import { getpdfReportdataError, getpdfReportdataSuccess, } from "./actions";
import { CommonConsole } from "../../../components/Common/CommonFunction";



function* getpdfData_GenFunc({ urlpath, config }) {

  try {
    debugger
    const response = yield call(urlpath, config);

    response["ReportType"] = config.ReportType
    response.Data["ReportType"] = config.ReportType
    if (Array.isArray(response.Data)) {
      // response.Data[0] = {};
      // response.Data[0] = response.Data;

      response.Data[0]["Period"] = config
    } else {
      response.Data["Period"] = config
    }



    if ((config.systemSetting) || (config.subPageMode)) {
      response.Data["SettingData"] = config.systemSetting
      response.Data["subPageMode"] = config.subPageMode;
      response.Data["forceA5"] = config.forceA5;
    }

    yield put(getpdfReportdataSuccess(response));

  } catch (error) {
    yield put(getpdfReportdataError())
    CommonConsole(error)
  }
}


function* pdfReport_Saga() {
  yield takeLatest(GET_PDF_REPORT_DATA, getpdfData_GenFunc);

}
export default pdfReport_Saga;
