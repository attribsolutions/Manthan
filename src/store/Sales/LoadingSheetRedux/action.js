import {
    LOADING_SHEET_LIST_ACTION,
    LOADING_SHEET_LIST_ACTION_SUCCESS,
    LOADING_LIST_PAGE_FILTERS_PARAMETER,
    LOADING_SHEET_GO_BUTTON_API,
    LOADING_SHEET_GO_BUTTON_API_SUCCESS,
    SAVE_LOADING_SHEET_MASTER,
    SAVE_LOADING_SHEET_MASTER_SUCCESS,
    LOADING_SHEET_UPDATE_API,
    LOADING_SHEET_UPDATE_API_ACTION_SUCCESS,
    DELETE_LOADING_SHEET,
    DELETE_LOADING_SHEET_SUCCESS,
    LOADING_SHEET_API_ERROR_ACTION
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
export const SaveLoadingSheetMaster = (config = {}) => ({
    type: SAVE_LOADING_SHEET_MASTER,
    config,
});

export const SaveLoadingSheetMasterSucccess = (resp) => ({
    type: SAVE_LOADING_SHEET_MASTER_SUCCESS,
    payload: resp,
});

// Post API For Loading Sheet List
export const LoadingSheetListAction = (filters) => ({
    type: LOADING_SHEET_LIST_ACTION,
    filters,
});

export const LoadingSheetListActionSuccess = (resp) => ({
    type: LOADING_SHEET_LIST_ACTION_SUCCESS,
    payload: resp,
});

export const UpdateLoadingSheet = (data) => ({
    type: LOADING_SHEET_UPDATE_API,
    data,
});

export const UpdateLoadingSheetSucccess = (data) => ({
    type: LOADING_SHEET_UPDATE_API_ACTION_SUCCESS,
    payload: data,
});

export const DeleteLoadingSheet = (config = {}) => ({
    type: DELETE_LOADING_SHEET,
    config,
});

export const DeleteLoadingSheetSucccess = (data) => ({
    type: DELETE_LOADING_SHEET_SUCCESS,
    payload: data,
});

export const LoadingSheetApiErrorAction = () => ({
    type: LOADING_SHEET_API_ERROR_ACTION,
})


