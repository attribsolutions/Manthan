import { currentDate_ymd } from "../../../components/Common/CommonFunction"
import { DELETE_INVOICE_LIST_PAGE_SUCCESS, EDIT_INVOICE_LIST_SUCCESS, INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS,
     GO_BUTTON_FOR_INVOICE_ADD_SUCCESS,
     INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS, 
     MAKE_IB_INVOICE_ACTION_SUCCESS} from "./actionType"

const INIT_STATE = {
    gobutton_Add: [],
    makeIBInvoice: { Status: false },
    postMsg: { Status: false },
    editData: { Status: false },
    Invoicelist: [],
    // invoicelistFilter: { fromdate: currentDate_ymd, todate: currentDate_ymd, customerSelect: { value: '', label: "All" } },
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

        case INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
        case INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS:
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
            case MAKE_IB_INVOICE_ACTION_SUCCESS:
                return {
                    ...state,
                    makeIBInvoice: action.payload,
                }
        default:
            return state
    }

}

export default InvoiceReducer