import {
    POST_CREDIT_DEBIT_DATA_EXPORT_API,
    POST_CREDIT_DEBIT_DATA_EXPORT_API_ERROR_ACTION,
    POST_CREDIT_DEBIT_DATA_EXPORT_API_SUCCESS
} from "./actionType";

export const postCreditDebitDataExport_API = (config = {}) => ({ // save Action
    type: POST_CREDIT_DEBIT_DATA_EXPORT_API,
    config,
});

export const postCreditDebitDataExport_API_Success = (resp) => ({ // Save  success
    type: POST_CREDIT_DEBIT_DATA_EXPORT_API_SUCCESS,
    payload: resp,
});

export const postCreditDebitDataExportApiErrorAction = () => ({
    type: POST_CREDIT_DEBIT_DATA_EXPORT_API_ERROR_ACTION,
})
