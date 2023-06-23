import {
    DELETE_INVOICE_LIST_PAGE_SUCCESS, EDIT_INVOICE_LIST_SUCCESS, INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS,
    GO_BUTTON_FOR_INVOICE_ADD_SUCCESS,
    INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS,
    MAKE_IB_INVOICE_ACTION_SUCCESS,
    INVOICE_SAVE_ADD_PAGE_ACTION,
    GO_BUTTON_FOR_INVOICE_ADD,
    INVOICE_LIST_GO_BUTTON_FILTER,
    INVOICE_API_ERROR_ACTION,
    UPLOADED_E_INVOICE_ACTION_SUCCESS,
    UPLOADED_E_WAY_BILL_ACTION_SUCCESS,
    CANCLE_E_WAY_BILL_ACTION_SUCCESS,
    CANCLE_E_INVOICE_ACTION_SUCCESS
} from "./actionType"

const INIT_STATE = {
    gobutton_Add: { Status: false },
    saveBtnloading: false,
    goBtnloading: false,
    makeIBInvoice: { Status: false },
    postMsg: { Status: false },
    editData: { Status: false },
    Invoicelist: [],
    deleteMsg: { Status: false },
    Uploaded_EInvoice: { Status: false },
    Uploaded_EwayBill: { Status: false },
    Cancel_EInvoice: { Status: false },
    Cancel_EwayBill: { Status: false },
    listBtnLoading: false,
}

const InvoiceReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // GO Button 
        case GO_BUTTON_FOR_INVOICE_ADD:
            return {
                ...state,
                goBtnloading: true,
                listBtnLoading: action.config.btnId,
            }

        // GO Button 
        case GO_BUTTON_FOR_INVOICE_ADD_SUCCESS:
            return {
                ...state,
                goBtnloading: false,
                listBtnLoading: false,
                gobutton_Add: action.payload,
            }

        case INVOICE_SAVE_ADD_PAGE_ACTION:
            return {
                ...state,
                saveBtnloading: true,
            }

        case INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS:
            return {
                ...state,
                saveBtnloading: false,
                postMsg: action.payload,
            }

        case INVOICE_LIST_GO_BUTTON_FILTER:
            return {
                ...state,
                goBtnloading: true,
            }

        case INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS:
            return {
                ...state,
                goBtnloading: false,
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
        case INVOICE_API_ERROR_ACTION:
            return {
                ...state,
                goBtnloading: false,
                saveBtnloading: false,
            }

        case UPLOADED_E_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                Uploaded_EInvoice: action.payload,
            }

        case UPLOADED_E_WAY_BILL_ACTION_SUCCESS:
            return {
                ...state,
                Uploaded_EwayBill: action.payload,
            }

        case CANCLE_E_WAY_BILL_ACTION_SUCCESS:
            return {
                ...state,
                Cancel_EwayBill: action.payload,
            }

        case CANCLE_E_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                Cancel_EInvoice: action.payload,
            }
            

        default:
            return state
    }
}

export default InvoiceReducer