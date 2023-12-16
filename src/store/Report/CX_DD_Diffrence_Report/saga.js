import { call, put, takeLatest } from "redux-saga/effects";
import { CX_DD_DIFFRENCE_GO_BUTTON_ACTION } from "./actionType";
import { amountCommaSeparateFunc } from "../../../components/Common/CommonFunction";
import { Cx_DD_Diffrence_Gobtn_Success, Cx_DD_Diffrence_ReportApiErrorAction, } from "./action";
import { Cx_DD_Diffrence_Report_GoButton_API } from "../../../helpers/backend_helper"

function* Cx_DD_DiffrenceReport_GenFunc({ config }) {

    try {
        const response = yield call(Cx_DD_Diffrence_Report_GoButton_API, config);

        response.Data.map((i, index) => {
            i.id = index + 1
            i.Quantity = amountCommaSeparateFunc(parseFloat(i.Quantity).toFixed(2)) //  Quantity show with commas
            i.CXRate = amountCommaSeparateFunc(parseFloat(i.CXRate).toFixed(2)) //  CXRate show with commas
            i.Diff = amountCommaSeparateFunc(parseFloat(i.Diff).toFixed(2)) //  Diff show with commas
            i.MRP = amountCommaSeparateFunc(parseFloat(i.MRP).toFixed(2)) //  MRP show with commas
            i.SumofDiff = amountCommaSeparateFunc(parseFloat(i.SumofDiff).toFixed(2)) //  SumofDiff show with commas
            i.DDRate = amountCommaSeparateFunc(parseFloat(i.DDRate).toFixed(2)) //  GrandTotal show with commas
            return i;
        });

        yield put(Cx_DD_Diffrence_Gobtn_Success(response.Data))
    } catch (error) { yield put(Cx_DD_Diffrence_ReportApiErrorAction()) }
}

function* Cx_DD_DiffrenceReportSaga() {
    yield takeLatest(CX_DD_DIFFRENCE_GO_BUTTON_ACTION, Cx_DD_DiffrenceReport_GenFunc)
}

export default Cx_DD_DiffrenceReportSaga;
