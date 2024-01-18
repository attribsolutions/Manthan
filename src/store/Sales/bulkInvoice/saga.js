import { call, put, takeLatest } from "redux-saga/effects";

import { Invoice_1_GoButton_API, Invoice_1_Save_API, } from "../../../helpers/backend_helper";
import { getOrdersMakeInvoiceDataActionSuccess, bulkInvoiceApiErrorAction, saveBulkInvoiceActionSuccess, } from "./action";
import { GET_ORDERS_MAKE_INVICE_DATA_ACTION, SAVE_BULK_INVOICE_ACTION, } from "./actionType";



function* makeBulKInvoice_button_genFunc({ config }) {
  try {
    const response = yield call(Invoice_1_GoButton_API, config); // GO-Botton SO-invoice Add Page API
    yield put(getOrdersMakeInvoiceDataActionSuccess(response));

  } catch (error) {
    yield put(bulkInvoiceApiErrorAction())
  }
}
function* saveBulKInvoice_genFunc({ config }) {
  try {
    const  response = yield call(Invoice_1_Save_API, config);
    yield put(saveBulkInvoiceActionSuccess(response));

  } catch (error) {
    yield put(bulkInvoiceApiErrorAction())
  }
}

function* BulkInvoiceSaga() {
  yield takeLatest(GET_ORDERS_MAKE_INVICE_DATA_ACTION, makeBulKInvoice_button_genFunc);
  yield takeLatest(SAVE_BULK_INVOICE_ACTION, saveBulKInvoice_genFunc);

}

export default BulkInvoiceSaga;




