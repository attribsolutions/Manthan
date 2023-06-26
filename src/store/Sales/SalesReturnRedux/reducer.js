import {
    SAVE_SALES_RETURN_MASTER_SUCCESS,
    INVOICE_NUMBER_SUCCESS,
    SALES_RETURN_LIST_API_SUCCESS,
    DELETE_SALES_RETURN_ID_SUCCESS,
    SALES_RETURN_LIST_API,
    SAVE_SALES_RETURN_MASTER,
    SALES_RUTURN_API_ERROR_ACTION
} from "./actionType"

const INIT_STATE = {
    loading: false,
    InvoiceNo: [],
    postMsg: { Status: false },
    salesReturnList: [],
    deleteMsg: { Status: false },
    saveBtnloading: false,
}

const SalesReturnReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case INVOICE_NUMBER_SUCCESS:
            return {
                ...state,
                InvoiceNo: action.payload,
            }
        case SAVE_SALES_RETURN_MASTER:
            return {
                ...state,
                saveBtnloading: true,
            }

        case SAVE_SALES_RETURN_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,

            }
        case SALES_RETURN_LIST_API:
            return {
                ...state,
                loading: true,
            }

        case SALES_RETURN_LIST_API_SUCCESS:
            return {
                ...state,
                salesReturnList: action.payload,
                loading: false

            }
        case DELETE_SALES_RETURN_ID_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }

        case SALES_RUTURN_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
            };
        default:
            return state
    }
}

export default SalesReturnReducer