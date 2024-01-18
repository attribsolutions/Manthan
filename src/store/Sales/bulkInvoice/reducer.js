import {
    BULK_INVOICE_API_ERROR_ACTION,
    GET_ORDERS_MAKE_INVICE_DATA_ACTION,
    GET_ORDERS_MAKE_INVICE_DATA_ACTION_SUCCESS,

    SAVE_BULK_INVOICE_ACTION,
    SAVE_BULK_INVOICE_ACTION_SUCCESS
} from "./actionType"

const INIT_STATE = {
    ordersBulkInvoiceData: { Status: false },
    makeBulkInvoiceLoading: false,
    postMsg: { Status: false },
    saveBtnloading: false,

}

const BulkInvoiceReducer = (state = INIT_STATE, action) => {

    switch (action.type) {

        case GET_ORDERS_MAKE_INVICE_DATA_ACTION:
            return {
                ...state,
                makeBulkInvoiceLoading: true,
                // listBtnLoading: action.config.btnId,
            }

        case GET_ORDERS_MAKE_INVICE_DATA_ACTION_SUCCESS:
            return {
                ...state,
                makeBulkInvoiceLoading: false,
                ordersBulkInvoiceData: action.payload,
            }

        case SAVE_BULK_INVOICE_ACTION:
            return {
                ...state,
                saveBtnloading: true,
            }

        case SAVE_BULK_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                saveBtnloading: false,
                postMsg: action.payload,
            }

        case BULK_INVOICE_API_ERROR_ACTION:
            return {
                ...state,
                makeBulkInvoiceLoading: false,
                saveBtnloading: false,
            }

        default:
            return state
    }
}

export default BulkInvoiceReducer