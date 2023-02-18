import { currentDate } from "../../../components/Common/ComponentRelatedCommonFile/listPageCommonButtons"
import { IB_INVOICE_LIST_FILTERS, GET_IB_INVOICE_LIST_PAGE_SUCCESS, INWARD_BUTTON_ID_SUCCESS, MAKE_IB_INVOICE_SUCCESS, POST_IB_INVOICE_SUCCESS } from "./actionType"

const INIT_STATE = {
    IB_Invoice: [],
    IB_InvoiceFilter: { fromdate: currentDate, todate: currentDate, CustomerSelect: { value: "", label: " All" } },
    InwardData: [],
    MakeIBInvoice: { Status: false },
    postMsg: { Status: false },
}

const IBInvoiceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case IB_INVOICE_LIST_FILTERS:
            return {
                ...state,
                IB_InvoiceFilter: action.payload,
            }

        case GET_IB_INVOICE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                IB_Invoice: action.payload,
            }
        // edit api
        case INWARD_BUTTON_ID_SUCCESS:
            return {
                ...state,
                InwardData: action.payload,
            };
        // Make IB Invoice
        case MAKE_IB_INVOICE_SUCCESS:
            return {
                ...state,
                MakeIBInvoice: action.payload,
            };
        case POST_IB_INVOICE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            };
        default:
            return state
    }
}

export default IBInvoiceReducer