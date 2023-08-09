import {
    POST_INVOICE_DATA_EXPORT_API,
    POST_INVOICE_DATA_EXPORT_API_SUCCESS,
    POST_INVOICE_DATA_EXPORT_API_ERROR_ACTION,
    POST_DELETE_INVOICE_DATA_EXPORT_API_SUCCESS,
    POST_DELETE_INVOICE_DATA_EXPORT_API
} from "./actionType";

export const postInvoiceDataExport_API = (config = {}) => ({ // save Action
    type: POST_INVOICE_DATA_EXPORT_API,
    config,
});

export const postInvoiceDataExport_API_Success = (resp) => ({ // Save  success
    type: POST_INVOICE_DATA_EXPORT_API_SUCCESS,
    payload: resp,
});

export const postDeleteInvoiceDataExport_API = (config = {}) => ({ // save Action
    type: POST_DELETE_INVOICE_DATA_EXPORT_API,
    config,
});

export const postDeleteInvoiceDataExport_API_Success = (resp) => ({ // Save  success
    type: POST_DELETE_INVOICE_DATA_EXPORT_API_SUCCESS,
    payload: resp,
});


export const postInvoiceDataExportApiErrorAction = () => ({
    type: POST_INVOICE_DATA_EXPORT_API_ERROR_ACTION,
})
