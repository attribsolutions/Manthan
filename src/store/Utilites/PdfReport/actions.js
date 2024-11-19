import {
  GET_PDF_REPORT_DATA,
  GET_PDF_REPORT_DATA_ERROR,
  GET_PDF_REPORT_DATA_SUCCESS
} from "./actionType";


export const getpdfReportdata = (urlpath, config) => ({

  type: GET_PDF_REPORT_DATA,
  urlpath, config
});

export const getpdfReportdataSuccess = (data) => ({
  type: GET_PDF_REPORT_DATA_SUCCESS,
  payload: data,
});

export const getpdfReportdataError = (data) => ({
  type: GET_PDF_REPORT_DATA_ERROR,
  payload: data,
});






