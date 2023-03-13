import { LOADING_SHEET_GO_BUTTON_API, LOADING_SHEET_GO_BUTTON_API_SUCCESS } from "./actionType";

export const LoadingSheet_GoBtn_API = (subPageMode, filters) => ({
    type: LOADING_SHEET_GO_BUTTON_API,
    subPageMode, filters,
});

export const LoadingSheet_GoBtn_API_Succcess = (data) => ({
    type: LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    payload: data,
});