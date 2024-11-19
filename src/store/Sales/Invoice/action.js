import {
    DELETE_INVOICE_LIST_PAGE,
    DELETE_INVOICE_LIST_PAGE_SUCCESS,
    EDIT_INVOICE_ACTION,
    EDIT_INVOICE_ACTION_SUCCESS,
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
    UPDATE_VEHICLE_INVOICE_ACTION,
    UPDATE_VEHICLE_INVOICE_SUCCESS,
    INVOICE_SEND_TO_SCM_ACTION,
    INVOICE_SEND_TO_SCM_ACTION_SUCCESS,
    UPDATE_INVOICE_ACTION,
    UPDATE_INVOICE_ACTION_SUCCESS,
    INVOICE_BULK_DELETE_IDS_ACTION,
    INVOICE_BULK_DELETE_IDS_SUCCESS,
    UPDATE_VEHICLE_CUSTOMER_INVOICE_ACTION,
    UPDATE_VEHICLE_CUSTOMER_INVOICE_ACTION_SUCCESS,

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
export const editInvoiceAction = (config = {}) => ({
    type: EDIT_INVOICE_ACTION,
    config,
})

export const editInvoiceActionSuccess = (editData) => ({
    type: EDIT_INVOICE_ACTION_SUCCESS,
    payload: editData,
})
// edit api
export const updateInvoiceAction = (config) => ({
    type: UPDATE_INVOICE_ACTION,
    config,
})

export const updateInvoiceActionSuccess = (reps) => ({
    type: UPDATE_INVOICE_ACTION_SUCCESS,
    payload: reps,
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


export const InvoiceSendToScm = (config = {}) => ({
    type: INVOICE_SEND_TO_SCM_ACTION,
    config,
});

export const InvoiceSendToScmSuccess = (resp) => ({
    type: INVOICE_SEND_TO_SCM_ACTION_SUCCESS,
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

//**************************** E-Invoice (upload ,cancel) ***************************************/

export const Uploaded_EInvoiceAction = (config) => ({
    type: UPLOADED_E_INVOICE_ACTION,
    config
});

export const Uploaded_EInvoiceSuccess = (data) => ({
    type: UPLOADED_E_INVOICE_ACTION_SUCCESS,
    payload: data,
});

export const Cancel_EInvoiceAction = (config) => ({
    type: CANCLE_E_INVOICE_ACTION,
    config
});

export const Cancel_EInvoiceSuccess = (data) => ({
    type: CANCLE_E_INVOICE_ACTION_SUCCESS,
    payload: data,
});

//**************************** E-WayBill (upload ,cancel) actions ***************************************/

export const Uploaded_EwayBillAction = (config) => ({
    type: UPLOADED_E_WAY_BILL_ACTION,
    config
});

export const Uploaded_EwayBillSuccess = (data) => ({
    type: UPLOADED_E_WAY_BILL_ACTION_SUCCESS,
    payload: data,
});

export const Cancel_EwayBillAction = (config) => ({
    type: CANCLE_E_WAY_BILL_ACTION,
    config
});

export const Cancel_EwayBillSuccess = (data) => ({
    type: CANCLE_E_WAY_BILL_ACTION_SUCCESS,
    payload: data,
});

// UpdateVehicleInvoice Action
export const UpdateVehicleInvoice_Action = (config) => ({
    type: UPDATE_VEHICLE_INVOICE_ACTION,
    config
});

export const UpdateVehicleInvoice_Success = (data) => ({
    type: UPDATE_VEHICLE_INVOICE_SUCCESS,
    payload: data,
});



export const Pos_UpdateVehicleCustomerInvoice_Action = (config) => ({
    type: UPDATE_VEHICLE_CUSTOMER_INVOICE_ACTION,
    config
});

export const Pos_UpdateVehicleCustomerInvoice_Action_Success = (data) => ({
    type: UPDATE_VEHICLE_CUSTOMER_INVOICE_ACTION_SUCCESS,
    payload: data,
});




// Invoice Bulk Delete
export const InvoiceBulkDelete_IDs_Action = (config = {}) => ({
    type: INVOICE_BULK_DELETE_IDS_ACTION,
    config,
});

export const InvoiceBulkDelete_IDs_Succcess = (resp) => ({
    type: INVOICE_BULK_DELETE_IDS_SUCCESS,
    payload: resp,
});

// Invoice Error Action
export const InvoiceApiErrorAction = () => ({
    type: INVOICE_API_ERROR_ACTION,
})