import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PDF_REPORT_DATA } from "./actionType";
import { Data } from "./DemoData";


import {
  SpinnerState,
} from "../../actions"
import { getpdfReportdataSuccess } from "./actions";


function* getpdfData_GenFunc({ urlpath = () => { }, ReportType, Id }) {
debugger
  try {
    const response = yield call(urlpath, Id);
    response["ReportType"] = ReportType
    response.Data["ReportType"] = ReportType
    yield put(getpdfReportdataSuccess(response));
   
  } catch (error) {
   

  }
}

// function* getpdfData_GenFunc({ urlpath = () => { }, ReportType, Id }) {
//   debugger
//     try {
//       const data = Data
//       // const response = yield call(urlpath, Id);
//       const response = data;
  
//       response["ReportType"] = ReportType
//       response.Data["ReportType"] = ReportType
//       yield put(getpdfReportdataSuccess(response));
     
//     } catch (error) {
     
  
//     }
//   }

function* pdfReport_Saga() {
  yield takeEvery(GET_PDF_REPORT_DATA, getpdfData_GenFunc);
}
export default pdfReport_Saga;
