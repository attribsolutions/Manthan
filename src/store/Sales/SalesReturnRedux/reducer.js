import { ADD_BUTTON_FOR_SALES_RETURN_SUCCESS, INVOICE_NUMBER_SUCCESS } from "./actionType"

const INIT_STATE = {
    InvoiceNo: [],
    addButton: []
}

const SalesReturnReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case INVOICE_NUMBER_SUCCESS:
            return {
                ...state,
                InvoiceNo: action.payload,
            }
        case ADD_BUTTON_FOR_SALES_RETURN_SUCCESS:
            return {
                ...state,
                addButton: action.payload,
            }
        default:
            return state
    }
}

export default SalesReturnReducer