import {
    SAVE_SALES_RETURN_MASTER_SUCCESS,
    INVOICE_NUMBER_SUCCESS,
    SALES_RETURN_LIST_API_SUCCESS,
    DELETE_SALES_RETURN_ID_SUCCESS,
    SALES_RETURN_LIST_API,
    SAVE_SALES_RETURN_MASTER,
    SALES_RETURN_API_ERROR_ACTION,
    DELETE_SALES_RETURN_ID,
    SALES_RETURN_ADD_BUTTON_ACTION,
    SALES_RETURN_ADD_BUTTON_ACTION_SUCCESS,
    INVOICE_NUMBER,
    SALES_RETURN_CONFIRM_BUTTON_ACTION,
    SALES_RETURN_CONFIRM_BUTTON_ACTION_SUCCESS,
    POST_SENT_TO_SUPERSTOCKIEST_ID,
    POST_SENT_TO_SUPERSTOCKIEST_ID_SUCCESS,
    RETURN_APPROVE_ACTION,
    RETURN_APPROVE_ACTION_SUCCESS
} from "./actionType"

const INIT_STATE = {
    loading: false,
    InvoiceNo: [],
    addButtonData: { Status: false },
    addBtnLoading: false,
    postMsg: { Status: false },
    salesReturnList: [],
    deleteMsg: { Status: false },
    saveBtnloading: false,
    listBtnLoading: false,
    invoiceNoDropDownLoading: false,
    confirmBtnData: { Status: false },
    sendToSSbtnTableData: { Status: false },
    sendToSSbtnLoading: false,
    ApprovrMsg: { Status: false }

}

const SalesReturnReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case SALES_RETURN_ADD_BUTTON_ACTION:
            return {
                ...state,
                addBtnLoading: true,
            }

        case SALES_RETURN_ADD_BUTTON_ACTION_SUCCESS:
            return {
                ...state,
                addBtnLoading: false,
                addButtonData: action.payload,
            }

        case INVOICE_NUMBER:
            return {
                ...state,
                invoiceNoDropDownLoading: true,
            }

        case INVOICE_NUMBER_SUCCESS:
            return {
                ...state,
                invoiceNoDropDownLoading: false,
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
                saveBtnloading: false,
                postMsg: action.payload,

            }


        case RETURN_APPROVE_ACTION:
            return {
                ...state,
                saveBtnloading: true,
            }

        case RETURN_APPROVE_ACTION_SUCCESS:
            return {
                ...state,
                saveBtnloading: false,
                ApprovrMsg: action.payload,

            }

        case SALES_RETURN_CONFIRM_BUTTON_ACTION:
            return {
                ...state,
                listBtnLoading: action.config.btnId,

            }

        case SALES_RETURN_CONFIRM_BUTTON_ACTION_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                confirmBtnData: action.payload,

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

        case DELETE_SALES_RETURN_ID:
            return {
                ...state,
                listBtnLoading: action.config.btnId,
            }

        case DELETE_SALES_RETURN_ID_SUCCESS:
            return {
                ...state,
                listBtnLoading: false,
                deleteMsg: action.payload,
            }

        case POST_SENT_TO_SUPERSTOCKIEST_ID:

            return {
                ...state,
                sendToSSbtnLoading: true,
                listBtnLoading: action.config.btnId,
            }

        case POST_SENT_TO_SUPERSTOCKIEST_ID_SUCCESS:

            return {
                ...state,
                sendToSSbtnLoading: false,
                listBtnLoading: false,
                sendToSSbtnTableData: action.payload,
            }

        case SALES_RETURN_API_ERROR_ACTION:
            return {
                ...state,
                addBtnLoading: false,
                saveBtnloading: false,
                loading: false,
                invoiceNoDropDownLoading: false,
                listBtnLoading: false,
                sendToSSbtnLoading: false,
            };
        default:
            return state
    }
}

export default SalesReturnReducer