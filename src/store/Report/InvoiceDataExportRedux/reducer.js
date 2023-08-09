import { POST_INVOICE_DATA_EXPORT_API, POST_INVOICE_DATA_EXPORT_API_SUCCESS, POST_INVOICE_DATA_EXPORT_API_ERROR_ACTION, POST_DELETE_INVOICE_DATA_EXPORT_API, POST_DELETE_INVOICE_DATA_EXPORT_API_SUCCESS } from "./actionType";

const INIT_STATE = {
    InvoiceDataExportGobtn: [],
    DeleteInvoiceDataExportGobtn: [],

    GoBtnLoading: false,
    ExcelBtnLoading: false
}

const InvoiceDataExportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_INVOICE_DATA_EXPORT_API:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading: action.config.btnId
            }

        case POST_INVOICE_DATA_EXPORT_API_SUCCESS:
            return {
                ...state,
                InvoiceDataExportGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            }

        case POST_DELETE_INVOICE_DATA_EXPORT_API:
            return {
                ...state,
                GoBtnLoading: action.config.btnId,
                ExcelBtnLoading: action.config.btnId
            }

        case POST_DELETE_INVOICE_DATA_EXPORT_API_SUCCESS:
            return {
                ...state,
                DeleteInvoiceDataExportGobtn: action.payload,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            }

        case POST_INVOICE_DATA_EXPORT_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
                ExcelBtnLoading: false
            };


        default:
            return state
    }
}

export default InvoiceDataExportReducer  