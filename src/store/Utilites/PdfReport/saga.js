import { call, put, takeEvery } from "redux-saga/effects";
import { GET_PDF_REPORT_DATA } from "./actionType";

import {
  SpinnerState,
} from "../../actions"
import { getpdfReportdataSuccess } from "./actions";


function* getpdfData_GenFunc({ urlpath = () => { }, Id }) {
  yield put(SpinnerState(true))
  try {
    const response = yield call(urlpath, Id);

    yield put(getpdfReportdataSuccess(response));
    yield put(SpinnerState(false))
  } catch (error) {
    yield put(SpinnerState(false))

  }
}

function* pdfReport_Saga() {
  yield takeEvery(GET_PDF_REPORT_DATA, getpdfData_GenFunc);
}
export default pdfReport_Saga;
