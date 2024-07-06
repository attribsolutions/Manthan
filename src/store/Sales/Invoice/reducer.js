import {
    DELETE_INVOICE_LIST_PAGE_SUCCESS, EDIT_INVOICE_ACTION_SUCCESS, INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS,
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
    CANCLE_E_INVOICE_ACTION_SUCCESS,
    UPLOADED_E_INVOICE_ACTION,
    CANCLE_E_WAY_BILL_ACTION,
    CANCLE_E_INVOICE_ACTION,
    MAKE_IB_INVOICE_ACTION,
    UPLOADED_E_WAY_BILL_ACTION,
    UPDATE_VEHICLE_INVOICE_SUCCESS,
    INVOICE_SEND_TO_SCM_ACTION,
    INVOICE_SEND_TO_SCM_ACTION_SUCCESS,
    EDIT_INVOICE_ACTION,
    UPDATE_INVOICE_ACTION,
    UPDATE_INVOICE_ACTION_SUCCESS,
    INVOICE_BULK_DELETE_IDS_ACTION,
    INVOICE_BULK_DELETE_IDS_SUCCESS,
    UPDATE_VEHICLE_CUSTOMER_INVOICE_ACTION_SUCCESS
} from "./actionType"

const INIT_STATE = {
    gobutton_Add: { Status: false },
    makeIBInvoice: { Status: false },
    postMsg: { Status: false },
    updateMsg: { Status: false },
    editData: { Status: false },
    Invoicelist: [],
    deleteMsg: { Status: false },
    Uploaded_EInvoice: { Status: false },
    Uploaded_EwayBill: { Status: false },
    Cancel_EInvoice: { Status: false },
    Cancel_EwayBill: { Status: false },
    Update_Vehicle_Invoice: [],
    Update_Vehicle_Customer_Invoice:[],
    invoiceBulkDelete: { Status: false },

    listBtnLoading: false,
    saveAndPdfBtnLoading: false,
    saveBtnloading: false,
    goBtnloading: false,
    invoiceBulkDeleteLoading: false,

    sendToScmMsg: { Status: false }
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
        /**************************************** */
        case INVOICE_SAVE_ADD_PAGE_ACTION:
            let { saveAndDownloadPdfMode = false } = action.config
            return {
                ...state,
                saveBtnloading: !saveAndDownloadPdfMode,
                saveAndPdfBtnLoading: saveAndDownloadPdfMode
            }
        case INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS:
            return {
                ...state,
                saveBtnloading: false,
                saveAndPdfBtnLoading: false,
                postMsg: action.payload,
            }
        /**************************************** */
        case INVOICE_LIST_GO_BUTTON_FILTER:
            return {
                ...state,
                goBtnloading: true,
                listBtnLoading: true,
            }
        case INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS:
            return {
                ...state,
                goBtnloading: false,
                listBtnLoading: false,
                Invoicelist: action.payload,
            }
        /**************************************** */


        case INVOICE_SEND_TO_SCM_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case INVOICE_SEND_TO_SCM_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                sendToScmMsg: action.payload,
            }
        /**************************************** */

        case EDIT_INVOICE_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        case EDIT_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                editData: action.payload,
            }
        /**************************************** */
        case UPDATE_INVOICE_ACTION:
            // let { saveAndDownloadPdfMode = false } = action.config
            return {
                ...state,
                saveBtnloading: true,

            }
        case UPDATE_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                saveBtnloading: false,
                updateMsg: action.payload,
            }
        /**************************************** */

        case DELETE_INVOICE_LIST_PAGE_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMsg: action.payload,
            }
        /**************************************** */
        case MAKE_IB_INVOICE_ACTION:
            return {
                ...state,
                listBtnLoading: true,
            }
        case MAKE_IB_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                makeIBInvoice: action.payload,
                listBtnLoading: false,
            }
        /**************************************** */

        case UPLOADED_E_INVOICE_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case UPLOADED_E_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                Uploaded_EInvoice: action.payload,
            }
        /**************************************** */
        case UPLOADED_E_WAY_BILL_ACTION:

            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case UPLOADED_E_WAY_BILL_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                Uploaded_EwayBill: action.payload,
            }
        /**************************************** */
        case CANCLE_E_WAY_BILL_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case CANCLE_E_WAY_BILL_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                Cancel_EwayBill: action.payload,
            }
        /**************************************** */
        case CANCLE_E_INVOICE_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }
        case CANCLE_E_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                Cancel_EInvoice: action.payload,
            }
        /**************************************** */
        case UPDATE_VEHICLE_INVOICE_SUCCESS:
            return {
                ...state,
                Update_Vehicle_Invoice: action.payload,
            }

        /**************************************** */

        case UPDATE_VEHICLE_CUSTOMER_INVOICE_ACTION_SUCCESS:
            return {
                ...state,
                Update_Vehicle_Customer_Invoice: action.payload,
            }
        /**************************************** */

        case INVOICE_BULK_DELETE_IDS_ACTION:
            return {
                ...state,
                invoiceBulkDeleteLoading: action.config.btnId,

            }

        case INVOICE_BULK_DELETE_IDS_SUCCESS:
            return {
                ...state,
                invoiceBulkDeleteLoading: false,
                invoiceBulkDelete: action.payload,

            }
        case INVOICE_API_ERROR_ACTION:
            return {
                ...state,
                listBtnLoading: false,
                goBtnloading: false,
                saveBtnloading: false,
                saveAndPdfBtnLoading: false,
                invoiceBulkDeleteLoading: false,
            }

        default:
            return state
    }
}

export default InvoiceReducer