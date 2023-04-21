<<<<<<< HEAD
import { ADD_BUTTON_FOR_SALES_RETURN_SUCCESS, INVOICE_NUMBER_SUCCESS } from "./actionType"

const INIT_STATE = {
    InvoiceNo: [],
    addButton: []
=======
import {
    SAVE_SALES_RETURN_MASTER_SUCCESS,
    INVOICE_NUMBER_SUCCESS,
    SALES_RETURN_LIST_API_SUCCESS,
    DELETE_SALES_RETURN_ID_SUCCESS
} from "./actionType"

const INIT_STATE = {
    InvoiceNo: [],
    postMsg: { Status: false },
    salesReturnList: [],
    deleteMsg: { Status: false },

>>>>>>> NewCommon
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
        case DELETE_SALES_RETURN_ID_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }
        default:
            return state
    }
}

export default SalesReturnReducer