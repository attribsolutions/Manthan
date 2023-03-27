import {
  GET_PDF_MULTIPLEINVOICE_DATA,
  GET_PDF_REPORT_DATA,
  GET_PDF_REPORT_DATA_SUCCESS
} from "./actionType";


export const getpdfReportdata = (urlpath,ReportType, Id) => ({
  type: GET_PDF_REPORT_DATA,
  urlpath, ReportType, Id
});

export const getpdfReportdataSuccess = (data) => ({
  type: GET_PDF_REPORT_DATA_SUCCESS,
  payload: data,
});


export const postpdfMultipleReportdata = (API, jsonBody,ReportType, Id) => ({
  type:GET_PDF_MULTIPLEINVOICE_DATA,
  API,jsonBody, ReportType, Id
});




