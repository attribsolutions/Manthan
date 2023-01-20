import { GET_INVOICE_LIST_PAGE, GET_INVOICE_LIST_PAGE_SUCCESS, GO_BUTTON_POST_FOR_INVOICE, GO_BUTTON_POST_FOR_INVOICE_SUCCESS, POST_INVOICE_MASTER, POST_INVOICE_MASTER_SUCCESS } from "./actionType";

// Go Button Post API for Invoice Master
export const GoButton_post_For_Invoice = (data,goBtnId) => ({
    type: GO_BUTTON_POST_FOR_INVOICE,
    data,goBtnId
});

export const GoButton_post_For_Invoice_Success = (data) => ({
    type: GO_BUTTON_POST_FOR_INVOICE_SUCCESS,
    payload: data,
});

// post api
export const postInvoiceMaster = (data,saveBtnid) => ({
    type: POST_INVOICE_MASTER,
    data,saveBtnid
});

export const postInvoiceMasterSuccess = (data) => ({
    type: POST_INVOICE_MASTER_SUCCESS,
    payload: data,
});

//get listpage api
export const getIssueListPage = (filters) => ({
    type: GET_INVOICE_LIST_PAGE,
    filters,
});

export const getIssueListPageSuccess = (data) => ({
    type: GET_INVOICE_LIST_PAGE_SUCCESS,
    payload: data,
});

// // listpage api
// export const deleteInvoiceId = (id) => ({
//     type: DELETE_INVOICE_LIST_PAGE,
//     id,
// });

// export const deleteInvoiceIdSuccess = (data) => ({
//     type: DELETE_INVOICE_LIST_PAGE_SUCCESS,
//     payload: data,
// });