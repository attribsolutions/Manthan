import { call, put, takeLatest } from "redux-saga/effects";
import {
    POST_CREDIT_DEBIT_DATA_EXPORT_API,
} from "./actionType";
import {
    postCreditDebitDataExport_API_Success,
    postCreditDebitDataExportApiErrorAction,
} from "./action";
import { CreditDebitDataExport_GoBtn_API, ReceiptDataExport_GoBtn_API } from "../../../helpers/backend_helper";
import { date_dmy_func, trailingZeros } from "../../../components/Common/CommonFunction";
import { url } from "../../../routes";

function* CreditDebitDataExport_Gen({ config }) {

    const { subPageMode } = config

    try {
        let response
        if (subPageMode === url.CREDIT_DATA_EXPORT || subPageMode === url.DEBIT_DATA_EXPORT) {
            response = yield call(CreditDebitDataExport_GoBtn_API, config);
            response.Data.map((i) => {
                // Convert quantity values to floats and format to remove trailing zeros
                i["QtyInNo"] = trailingZeros(i.QtyInNo);
                i["QtyInKg"] = trailingZeros(i.QtyInKg);
                i["QtyInBox"] = trailingZeros(i.QtyInBox);
                i["InvoiceDate"] = date_dmy_func(i.InvoiceDate);

                return i;
            });
        }
        else {
            response = yield call(ReceiptDataExport_GoBtn_API, config);
        }

        response["goBtnMode"] = config.goBtnMode;


        yield put(postCreditDebitDataExport_API_Success(response));
    } catch (error) {
        yield put(postCreditDebitDataExportApiErrorAction());
    }
}

function* CreditDebitDataExportSaga() {
    yield takeLatest(POST_CREDIT_DEBIT_DATA_EXPORT_API, CreditDebitDataExport_Gen)
}

export default CreditDebitDataExportSaga;