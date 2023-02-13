import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import { DELETE_INVOICE_LIST_PAGE_SUCCESS, EDIT_INVOICE_LIST_SUCCESS, GET_INVOICE_LIST_PAGE_SUCCESS, GO_BUTTON_FOR_INVOICE_ADD_SUCCESS, GO_BUTTON_POST_FOR_INVOICE_SUCCESS, POST_INVOICE_MASTER_SUCCESS } from "./actionType"

const INIT_STATE = {
    gobutton_Add: [],
    GoButton: [],
    postMsg: { Status: false },
    editData: { Status: false },
    Invoicelist: [],
    invoicelistFilter: { fromdate: currentDate, todate: currentDate, customerSelect: { value: '', label: "All" } },
    deleteMsg: { Status: false },
}

const InvoiceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        // GO Button 
        case GO_BUTTON_FOR_INVOICE_ADD_SUCCESS:
            return {
                ...state,
                gobutton_Add: action.payload,
            }
        
        // GO Button 
        case GO_BUTTON_POST_FOR_INVOICE_SUCCESS:
            return {
                ...state,
                GoButton: action.payload,
            }

        case POST_INVOICE_MASTER_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
        case GET_INVOICE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                Invoicelist: action.payload,
            }
        case EDIT_INVOICE_LIST_SUCCESS:
            return {
                ...state,
                editData: action.payload,
            }
        case DELETE_INVOICE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                deleteMsg: action.payload,
            }
        default:
            return state
    }

}

export default InvoiceReducer