import {

    BULK_INVOICE_API_ERROR_ACTION,
    GET_ORDERS_MAKE_INVICE_DATA_ACTION,
    GET_ORDERS_MAKE_INVICE_DATA_ACTION_SUCCESS,
    SAVE_BULK_INVOICE_ACTION,
    SAVE_BULK_INVOICE_ACTION_SUCCESS
} from "./actionType";


export const getOrdersMakeInvoiceDataAction = (config = {}) => ({
    type: GET_ORDERS_MAKE_INVICE_DATA_ACTION,
    config,
});

export const getOrdersMakeInvoiceDataActionSuccess = (resp) => ({
    type: GET_ORDERS_MAKE_INVICE_DATA_ACTION_SUCCESS,
    payload: resp,
});

export const saveBulkInvoiceAction = (config = {}) => ({
    type: SAVE_BULK_INVOICE_ACTION,
    config,
});

export const saveBulkInvoiceActionSuccess = (resp) => ({
    type: SAVE_BULK_INVOICE_ACTION_SUCCESS,
    payload: resp,
});

// bulk Invoice Error Action
export const bulkInvoiceApiErrorAction = () => ({
    type: BULK_INVOICE_API_ERROR_ACTION,
})