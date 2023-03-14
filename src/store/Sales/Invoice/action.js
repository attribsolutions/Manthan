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
    MAKE_IB_INVOICE_ACTION_SUCCESS
} from "./actionType";




//get listpage api
export const invoiceListGoBtnfilter = (config) => ({
    type: INVOICE_LIST_GO_BUTTON_FILTER,
   config,
});

export const invoiceListGoBtnfilterSucccess = (data) => ({
    type: INVOICE_LIST_GO_BUTTON_FILTER_SUCCESS,
    payload: data,
});

// edit api
export const editInvoiceList = (id, pageMode, subPageMode) => ({
    type: EDIT_INVOICE_LIST,
    id, pageMode, subPageMode,
})

export const editInvoiceListSuccess = (editData) => ({
    type: EDIT_INVOICE_LIST_SUCCESS,
    payload: editData,
})

// listpage api
export const deleteInvoiceId = (id, subPageMode) => ({
    type: DELETE_INVOICE_LIST_PAGE,
    id,subPageMode,
});

export const deleteInvoiceIdSuccess = (data) => ({
    type: DELETE_INVOICE_LIST_PAGE_SUCCESS,
    payload: data,
});


// Go Button Post API for Invoice Master
export const GoButtonForinvoiceAdd = (body) => ({
    type: GO_BUTTON_FOR_INVOICE_ADD,
    body,
});

export const GoButtonForinvoiceAddSuccess = (data) => ({
    type: GO_BUTTON_FOR_INVOICE_ADD_SUCCESS,
    payload: data,
});

// post api
export const invoiceSaveAction = (subPageMode, data, saveBtnid) => ({
    type: INVOICE_SAVE_ADD_PAGE_ACTION,
    subPageMode, data, saveBtnid
});

export const invoiceSaveActionSuccess = (data) => ({
    type: INVOICE_SAVE_ADD_PAGE_ACTION_SUCCESS,
    payload: data,
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