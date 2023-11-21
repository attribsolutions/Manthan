import { GET_DASHBOARD_DETAILS, GET_DASHBOARD_DETAILS_SUCCESS, GET_DASHBOARD_GRN_DATA_DETAILS, GET_DASHBOARD_GRN_DATA_DETAILS_SUCCESS, GET_DASHBOARD_INVOICE_DATA_DETAILS, GET_DASHBOARD_INVOICE_DATA_DETAILS_SUCCESS, GET_DASHBOARD_ORDER_DATA_DETAILS, GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS, ORDER_VIEW } from "./actionType";

export const getDashbordDetails = (config = {}) => ({
    type: GET_DASHBOARD_DETAILS,
    config,
});

export const getDashbordDetails_Success = resp => ({
    type: GET_DASHBOARD_DETAILS_SUCCESS,
    payload: resp,
})


export const Get_Dashboard_Order_Data = (config = {}) => ({
    type: GET_DASHBOARD_ORDER_DATA_DETAILS,
    config,

});

export const Get_Dashboard_Order_Data_Success = resp => ({
    type: GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS,
    payload: resp,
});

export const Get_Dashboard_Invoice_Data = (config = {}) => ({
    type: GET_DASHBOARD_INVOICE_DATA_DETAILS,
    config,

}); export const Get_Dashboard_Invoice_Data_Success = resp => ({
    type: GET_DASHBOARD_INVOICE_DATA_DETAILS_SUCCESS,
    payload: resp,

}); export const Get_Dashboard_Grn_Data = (config = {}) => ({
    type: GET_DASHBOARD_GRN_DATA_DETAILS,
    config,

}); export const Get_Dashboard_Grn_Data_Success = (resp) => ({
    type: GET_DASHBOARD_GRN_DATA_DETAILS_SUCCESS,
    payload: resp,

});

