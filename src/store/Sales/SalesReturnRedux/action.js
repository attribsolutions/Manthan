
// Invoice number dropdown API
export const InvoiceNumber = (jsonBody) => ({
    type: INVOICE_NUMBER,
    jsonBody,
  });
  
  export const InvoiceNumberSuccess = resp => ({
    type: INVOICE_NUMBER_SUCCESS,
    payload: resp,
  })
  