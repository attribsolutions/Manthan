import { GET_PDF_REPORT_DATA, GET_PDF_REPORT_DATA_SUCCESS } from "./actionType";


export const getpdfReportdata = (urlpath, Id) => ({
  type: GET_PDF_REPORT_DATA,
  urlpath, Id
});

export const getpdfReportdataSuccess = (data) => ({
  type: GET_PDF_REPORT_DATA_SUCCESS,
  payload: data,
});


