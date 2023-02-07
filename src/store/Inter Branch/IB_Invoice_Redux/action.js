import {
  IB_INVOICE_LIST_FILTERS,
  GET_IB_INVOICE_LIST_PAGE,
  GET_IB_INVOICE_LIST_PAGE_SUCCESS,
  INWARD_BUTTON_ID,
  INWARD_BUTTON_ID_SUCCESS,
  MAKE_IB_INVOICE,
  MAKE_IB_INVOICE_SUCCESS
} from "./actionType";

export const IB_Invoicelistfilters = filter => ({
  type: IB_INVOICE_LIST_FILTERS,
  payload: filter,
})

//Challan listpage api
export const get_IB_InvoiceListPage = (filters) => ({
  type: GET_IB_INVOICE_LIST_PAGE,
  filters,
});

export const get_IB_InvoiceListPageSuccess = (data) => ({
  type: GET_IB_INVOICE_LIST_PAGE_SUCCESS,
  payload: data,
});

//Inward Button api
export const InwardButtonId = (id) => ({
  type: INWARD_BUTTON_ID,
  id
})
export const InwardButtonIdSuccess = (editData) => ({
  type: INWARD_BUTTON_ID_SUCCESS,
  payload: editData,
})

//For Make Invoice 
export const MakeIBInvoice = (data) => ({
  type: MAKE_IB_INVOICE,
  data
})
export const MakeIBInvoiceSuccess = (data) => ({
  type: MAKE_IB_INVOICE_SUCCESS,
  payload: data,
})