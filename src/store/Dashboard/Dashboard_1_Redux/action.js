import { GET_DASHBOARD_DETAILS, GET_DASHBOARD_DETAILS_SUCCESS } from "./actionType";

export const getDashbordDetails = () => ({
    type: GET_DASHBOARD_DETAILS,
});

export const getDashbordDetails_Success = resp => ({
    type: GET_DASHBOARD_DETAILS_SUCCESS,
    payload: resp,
})