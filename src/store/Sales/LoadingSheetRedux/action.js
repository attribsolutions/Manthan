import {
    GET_LOADING_SHEET_LIST,
    GET_LOADING_SHEET_LIST_SUCCESS,
    LOADING_LIST_PAGE_FILTERS_PARAMETER,
    LOADING_SHEET_GO_BUTTON_API,
    LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    SAVE_LOADING_SHEET_MASTER,
    SAVE_LOADING_SHEET_MASTER_SUCCESS
} from "./actionType";



export const LoadingSheetlistfilter = filter => ({
    type: LOADING_LIST_PAGE_FILTERS_PARAMETER,
    payload: filter,
  })


// Go Button API For Loading Sheet Master
export const LoadingSheet_GoBtn_API = (filters) => ({  
    type: LOADING_SHEET_GO_BUTTON_API,
    filters,
});

export const LoadingSheet_GoBtn_API_Succcess = (data) => ({
    type: LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    payload: data,
});

// Post API For Loading Sheet Master
export const SaveLoadingSheetMaster = (config={}) => ({
    type: SAVE_LOADING_SHEET_MASTER,
    config,
});

export const SaveLoadingSheetMasterSucccess = (resp) => ({
    type: SAVE_LOADING_SHEET_MASTER_SUCCESS,
    payload: resp,
});

// Post API For Loading Sheet List
export const getLoadingSheetList = (data) => ({
    type: GET_LOADING_SHEET_LIST,
    data,
});

export const getLoadingSheetListSucccess = (resp) => ({
    type: GET_LOADING_SHEET_LIST_SUCCESS,
    payload: resp,
});