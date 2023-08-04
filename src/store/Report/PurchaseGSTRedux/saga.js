import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_PURCHASE_GST_REPORT_API,
} from "./actionType";
import { postPurchaseGSTReport_API_Success, postPurchaseGSTReportApiErrorAction, postRetailerData_API_Success, RetailerDataApiErrorAction } from "./action";
import { PurchaseGSTReportSaga_GoBtn_API } from "../../../helpers/backend_helper";
import { date_dmy_func } from "../../../components/Common/CommonFunction";

function* PurchaseGSTReport_Gen({ config }) {

    try {

        const response = yield call(PurchaseGSTReportSaga_GoBtn_API, config);
        response.Data["btnId"] = config.btnId;
        let newresponse = []

        if (response.Data.PurchaseGSTDetails) {
            let TotalTaxableValue = 0
            let TotalCGST = 0
            let TotalSGST = 0
            let TotalIGST = 0
            let TotalGSTAmount = 0
            let TotalDiscountAmount = 0
            let TotalTotalValue = 0

            newresponse = yield response.Data.PurchaseGSTDetails.map((i, key) => {
                i.id = key + 1
                TotalTaxableValue = Number(TotalTaxableValue) + Number(i.TaxableValue)
                TotalCGST = Number(TotalCGST) + Number(i.CGST)
                TotalSGST = Number(TotalSGST) + Number(i.SGST)
                TotalIGST = Number(TotalIGST) + Number(i.IGST)
                TotalGSTAmount = Number(TotalGSTAmount) + Number(i.GSTAmount)
                TotalDiscountAmount = Number(TotalDiscountAmount) + Number(i.DiscountAmount)
                TotalTotalValue = Number(TotalTotalValue) + Number(i.TotalValue)
                i["InvoiceDate"] = date_dmy_func(i.InvoiceDate)
                return i
            })

            newresponse.push({
                id: response.Data.PurchaseGSTDetails.length + 1,
                Name: "Total",
                TaxableValue: TotalTaxableValue.toFixed(2),
                CGST: TotalCGST.toFixed(2),
                SGST: TotalSGST.toFixed(2),
                IGST: TotalIGST.toFixed(2),
                GSTAmount: TotalGSTAmount.toFixed(2),
                DiscountAmount: TotalDiscountAmount.toFixed(2),
                TotalValue: TotalTotalValue.toFixed(2),
            })

        } else {


            let TotalTaxableValue = 0
            let TotalCGST = 0
            let TotalSGST = 0
            let TotalIGST = 0
            let TotalGSTAmount = 0
            let TotalTotalValue = 0

            newresponse = yield response.Data.PurchaseGSTRateWiseDetails.map((i, key) => {
                i.id = key + 1
                TotalTaxableValue = Number(TotalTaxableValue) + Number(i.TaxableValue)
                TotalCGST = Number(TotalCGST) + Number(i.CGST)
                TotalSGST = Number(TotalSGST) + Number(i.SGST)
                TotalIGST = Number(TotalIGST) + Number(i.IGST)
                TotalGSTAmount = Number(TotalGSTAmount) + Number(i.GSTAmount)
                TotalTotalValue = Number(TotalTotalValue) + Number(i.TotalValue)
                return i
            })

            newresponse.push({
                id: response.Data.PurchaseGSTRateWiseDetails.length + 1,
                GSTPercentage: "Total",
                TaxableValue: TotalTaxableValue.toFixed(2),
                CGST: TotalCGST.toFixed(2),
                SGST: TotalSGST.toFixed(2),
                IGST: TotalIGST.toFixed(2),
                GSTAmount: TotalGSTAmount.toFixed(2),
                TotalValue: TotalTotalValue.toFixed(2),
            })

        }

        if (response.Data.PurchaseGSTDetails) {
            response.Data["PurchaseGSTDetails"] = newresponse;
        } else {
            response.Data["PurchaseGSTRateWiseDetails"] = newresponse;

        }

        yield put(postPurchaseGSTReport_API_Success(response.Data))
    } catch (error) { yield put(postPurchaseGSTReportApiErrorAction()) }
}

function* PurchaseGSTReportSaga() {
    yield takeLatest(POST_PURCHASE_GST_REPORT_API, PurchaseGSTReport_Gen)
}

export default PurchaseGSTReportSaga;