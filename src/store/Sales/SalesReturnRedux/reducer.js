import { SAVE_SALES_RETURN_MASTER_SUCCESS, INVOICE_NUMBER_SUCCESS, SALES_RETURN_LIST_API_SUCCESS } from "./actionType"

const INIT_STATE = {
    InvoiceNo: [],
    postMsg: { Status: false },
    salesReturnList:[],
}

const SalesReturnReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case INVOICE_NUMBER_SUCCESS:
            return {
                ...state,
                InvoiceNo: action.payload,
            }
        case SAVE_SALES_RETURN_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
        case SALES_RETURN_LIST_API_SUCCESS:
            return {
                ...state,
                salesReturnList: action.payload,
            }
        default:
            return state
    }
}

export default SalesReturnReducer