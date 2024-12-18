import { call, put, takeLatest } from "redux-saga/effects";
import { GET_PDF_REPORT_DATA } from "./actionType";

import { getpdfReportdataError, getpdfReportdataSuccess, } from "./actions";
import { CommonConsole } from "../../../components/Common/CommonFunction";



function* getpdfData_GenFunc({ urlpath, config }) {

  try {
    
    const response = yield call(urlpath, config);

    response["ReportType"] = config.ReportType
    response.Data["ReportType"] = config.ReportType
    response.Data["Period"] = config

    let i = {
      SAPOrderNo: response.Data?.SAPOrderNo || "", // Default to an empty string if null or undefined
      FullOrderNumber: response.Data?.FullOrderNumber || "", // Default to an empty string if null or undefined
    };

    // Ensure SAPOrderNo has digits to process
    if (i.SAPOrderNo) {
      var numb = i.SAPOrderNo.match(/\d/g);
      i.SAPOrderNo = numb ? numb.join("") : ""; // Join digits if found, else default to an empty string
    }

    // Combine with FullOrderNumber conditionally
    response.Data["FullOrderNumber"] = i.SAPOrderNo
      ? `${i.FullOrderNumber} (${i.SAPOrderNo})`
      : i.FullOrderNumber; // If SAPOrderNo is empty, show only FullOrderNumber


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
