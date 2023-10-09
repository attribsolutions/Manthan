import { GET_DASHBOARD_DETAILS, GET_DASHBOARD_DETAILS_SUCCESS, GET_DASHBOARD_ORDER_DATA_DETAILS, GET_DASHBOARD_ORDER_DATA_DETAILS_SUCCESS } from "./actionType";

export const getDashbordDetails = () => ({
    type: GET_DASHBOARD_DETAILS,
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
})