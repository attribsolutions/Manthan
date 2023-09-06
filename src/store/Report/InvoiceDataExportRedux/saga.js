import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_DELETE_INVOICE_DATA_EXPORT_API,
    POST_INVOICE_DATA_EXPORT_API,
} from "./actionType";
import {
    postDeleteInvoiceDataExport_API_Success,
    postInvoiceDataExport_API_Success,
    postInvoiceDataExportApiErrorAction
} from "./action";
import { InvoiceDataExport_GoBtn_API, DeleteInvoiceDataExport_GoBtn_API } from "../../../helpers/backend_helper";
import { date_dmy_func, trailingZeros } from "../../../components/Common/CommonFunction";

function* InvoiceDataExport_Gen({ config }) {

    try {
        const response = yield call(InvoiceDataExport_GoBtn_API, config);

        response["goBtnMode"] = config.goBtnMode;

        response.Data.map((i) => {
            // Convert quantity values to floats and format to remove trailing zeros
            i["QtyInNo"] = trailingZeros(i.QtyInNo);
            i["QtyInKg"] = trailingZeros(i.QtyInKg);
            i["QtyInBox"] = trailingZeros(i.QtyInBox);
            i["InvoiceDate"] = date_dmy_func(i.InvoiceDate);

            return i;
        });



        yield put(postInvoiceDataExport_API_Success(response));
    } catch (error) {
        yield put(postInvoiceDataExportApiErrorAction());
    }
}

function* DeleteInvoiceDataExport_Gen({ config }) {
    try {
        const response = yield call(DeleteInvoiceDataExport_GoBtn_API, config);
        response.Data["btnId"] = config.btnId;

        // Perform the date transformation for InvoiceDate and OrderDate
        const transformedDetails = response.Data.DeletedInvoiceExportSerializerDetails.map(i => ({
            ...i,
            InvoiceDate: date_dmy_func(i.InvoiceDate),
            QtyInNo: trailingZeros(i.QtyInNo), // Convert and remove trailing zeros
            QtyInKg: trailingZeros(i.QtyInKg),
            QtyInBox: trailingZeros(i.QtyInBox),
        }));

        response.Data["DeletedInvoiceExportSerializerDetails"] = transformedDetails;

        yield put(postDeleteInvoiceDataExport_API_Success(response.Data));
    } catch (error) {
        yield put(postInvoiceDataExportApiErrorAction());
    }
}

function* InvoiceDataExportSaga() {
    yield takeLatest(POST_INVOICE_DATA_EXPORT_API, InvoiceDataExport_Gen)
    yield takeLatest(POST_DELETE_INVOICE_DATA_EXPORT_API, DeleteInvoiceDataExport_Gen)
}

export default InvoiceDataExportSaga;