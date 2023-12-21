import { call, put, takeLatest } from "redux-saga/effects";
import { CX_DD_DIFFRENCE_GO_BUTTON_ACTION } from "./actionType";
import { amountCommaSeparateFunc,roundToDecimalPlaces } from "../../../components/Common/CommonFunction";
import { Cx_DD_Diffrence_Gobtn_Success, Cx_DD_Diffrence_ReportApiErrorAction, } from "./action";
import { Cx_DD_Diffrence_Report_GoButton_API } from "../../../helpers/backend_helper"

function* Cx_DD_DiffrenceReport_GenFunc({ config }) {

    try {
        const response = yield call(Cx_DD_Diffrence_Report_GoButton_API, config);

        response.Data.map((i, index) => {
            i.id = index + 1
            i.Quantity = roundToDecimalPlaces(i.Quantity,2,true) //  Quantity show with commas
            i.CXRate = roundToDecimalPlaces(i.CXRate,2,true) //  CXRate show with commas
            i.Diff = roundToDecimalPlaces(i.Diff,2,true) //  Diff show with commas
            i.MRP = roundToDecimalPlaces(i.MRP,2,true) //  MRP show with commas
            i.SumofDiff = roundToDecimalPlaces(i.SumofDiff,2,true)//  SumofDiff show with commas
            i.DDRate = roundToDecimalPlaces(i.DDRate,2,true) //  GrandTotal show with commas
            return i;
        });

        yield put(Cx_DD_Diffrence_Gobtn_Success(response.Data))
    } catch (error) { yield put(Cx_DD_Diffrence_ReportApiErrorAction()) }
}

function* Cx_DD_DiffrenceReportSaga() {
    yield takeLatest(CX_DD_DIFFRENCE_GO_BUTTON_ACTION, Cx_DD_DiffrenceReport_GenFunc)
}

export default Cx_DD_DiffrenceReportSaga;
