import { INVOICE_NUMBER_SUCCESS } from "./actionType"

const INIT_STATE = {
    InvoiceNo: [],
}

const SalesReturnReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case INVOICE_NUMBER_SUCCESS:
            return {
                ...state,
                InvoiceNo: action.payload,
            }
        default:
            return state
    }
}

export default SalesReturnReducer