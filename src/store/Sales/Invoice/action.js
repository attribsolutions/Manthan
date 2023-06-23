import {
    DELETE_INVOICE_LIST_PAGE,
    DELETE_INVOICE_LIST_PAGE_SUCCESS,
    EDIT_INVOICE_LIST,
    EDIT_INVOICE_LIST_SUCCESS,
    INVOICE_LIST_GO_BUTTON_FILTER,
    INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS,
    GO_BUTTON_FOR_INVOICE_ADD,
    GO_BUTTON_FOR_INVOICE_ADD_SUCCESS,
    INVOICE_SAVE_ADD_PAGE_ACTION,
    INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS,
    MAKE_IB_INVOICE_ACTION,
    MAKE_IB_INVOICE_ACTION_SUCCESS,
    INVOICE_API_ERROR_ACTION,
    UPLOADED_E_INVOICE_ACTION,
    UPLOADED_E_INVOICE_ACTION_SUCCESS,
    UPLOADED_E_WAY_BILL_ACTION,
    UPLOADED_E_WAY_BILL_ACTION_SUCCESS,
    CANCLE_E_INVOICE_ACTION,
    CANCLE_E_INVOICE_ACTION_SUCCESS,
    CANCLE_E_WAY_BILL_ACTION,
    CANCLE_E_WAY_BILL_ACTION_SUCCESS,
    PRINT_E_WAY_BILL_ACTION,
    PRINT_E_WAY_BILL_SUCCESS,
    PRINT_E_INVOICE_ACTION,
    PRINT_E_INVOICE_SUCCESS
} from "./actionType";




//get listpage api
export const invoiceListGoBtnfilter = (config = {}) => ({
    type: INVOICE_LIST_GO_BUTTON_FILTER,
    config,
});

export const invoiceListGoBtnfilterSucccess = (resp) => ({
    type: INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS,
    payload: resp,
});

// edit api
export const editInvoiceList = (config = {}) => ({
    type: EDIT_INVOICE_LIST,
    config,
})

export const editInvoiceListSuccess = (editData) => ({
    type: EDIT_INVOICE_LIST_SUCCESS,
    payload: editData,
})

// listpage api
export const deleteInvoiceId = (config = {}) => ({
    type: DELETE_INVOICE_LIST_PAGE,
    config,
});

export const deleteInvoiceIdSuccess = (resp) => ({
    type: DELETE_INVOICE_LIST_PAGE_SUCCESS,
    payload: resp,
});


// Go Button Post API for Invoice Master
export const GoButtonForinvoiceAdd = (config = {}) => ({
    type: GO_BUTTON_FOR_INVOICE_ADD,
    config,
});

export const GoButtonForinvoiceAddSuccess = (resp) => ({
    type: GO_BUTTON_FOR_INVOICE_ADD_SUCCESS,
    payload: resp,
});

// post api
export const invoiceSaveAction = (config = {}) => ({
    type: INVOICE_SAVE_ADD_PAGE_ACTION,
    config,
});

export const invoiceSaveActionSuccess = (resp) => ({
    type: INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS,
    payload: resp,
});


// post api
export const makeIB_InvoiceAction = (body) => ({
    type: MAKE_IB_INVOICE_ACTION,
    body
});

export const makeIB_InvoiceActionSuccess = (data) => ({
    type: MAKE_IB_INVOICE_ACTION_SUCCESS,
    payload: data,
});

export const InvoiceApiErrorAction = () => ({
    type: INVOICE_API_ERROR_ACTION,
})

//**************************** E-Invoice (upload ,cancel) ***************************************/

export const Uploaded_EInvoiceAction = (RowId) => ({
    type: UPLOADED_E_INVOICE_ACTION,
    RowId
});

export const Uploaded_EInvoiceSuccess = (data) => ({
    type: UPLOADED_E_INVOICE_ACTION_SUCCESS,
    payload: data,
});

export const Cancel_EInvoiceAction = (RowId) => ({
    type: CANCLE_E_INVOICE_ACTION,
    RowId
});

export const Cancel_EInvoiceSuccess = (data) => ({
    type: CANCLE_E_INVOICE_ACTION_SUCCESS,
    payload: data,
});

//**************************** E-WayBill (upload ,cancel) actions ***************************************/

export const Uploaded_EwayBillAction = (RowId) => ({
    type: UPLOADED_E_WAY_BILL_ACTION,
    RowId
});

export const Uploaded_EwayBillSuccess = (data) => ({
    type: UPLOADED_E_WAY_BILL_ACTION_SUCCESS,
    payload: data,
});

export const Cancel_EwayBillAction = (RowId) => ({
    type: CANCLE_E_WAY_BILL_ACTION,
    RowId
});

export const Cancel_EwayBillSuccess = (data) => ({
    type: CANCLE_E_WAY_BILL_ACTION_SUCCESS,
    payload: data,
});

