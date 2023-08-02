import { POST_INVOICE_DATA_EXPORT_API, POST_INVOICE_DATA_EXPORT_API_SUCCESS, POST_INVOICE_DATA_EXPORT_API_ERROR_ACTION } from "./actionType";

const INIT_STATE = {
    InvoiceDataExportGobtn: [],
    GoBtnLoading: false
}

const InvoiceDataExportReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_INVOICE_DATA_EXPORT_API:
            return {
                ...state,
                GoBtnLoading: true
            }

        case POST_INVOICE_DATA_EXPORT_API_SUCCESS:
            return {
                ...state,
                InvoiceDataExportGobtn: action.payload,
                GoBtnLoading: false
            }

        case POST_INVOICE_DATA_EXPORT_API_ERROR_ACTION:
            return {
                ...state,
                GoBtnLoading: false,
            };


        default:
            return state
    }
}

export default InvoiceDataExportReducer  