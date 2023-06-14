import {
    SAVE_MARGIN_MASTER,
    SAVE_MARGIN_MASTER_SUCCESS,
    GET_MARGIN_LIST,
    GET_MARGIN_LIST_SUCCESS,
    DELETE_MARGIN_LIST_ID,
    DELETE_MARGIN_LIST_ID_SUCCESS,
    GO_BUTTON_FOR_MARGIN_MASTER,
    GO_BUTTON_FOR_MARGIN_MASTER_SUCCESS,
    DELETE_ID_FOR_MARGIN_MASTER,
    DELETE_ID_FOR_MARGIN_MASTER_SUCCESS,
    MARGIN_API_ERROR_ACTION
} from "./actionType";

// post api
export const saveMarginMaster = (config = {}) => ({
    type: SAVE_MARGIN_MASTER,
    config,
});

export const saveMarginMasterSuccess = (resp) => ({
    type: SAVE_MARGIN_MASTER_SUCCESS,
    payload: resp,
});

//get listpage api
export const getMarginList = () => ({
    type: GET_MARGIN_LIST,
});

export const getMarginListSuccess = (resp) => ({
    type: GET_MARGIN_LIST_SUCCESS,
    payload: resp,
});

//delete for List Page
export const delete_MarginList_ID = (config = {}) => ({
    type: DELETE_MARGIN_LIST_ID,
    config,
});

export const delete_MarginList_ID_Success = (resp) => ({
    type: DELETE_MARGIN_LIST_ID_SUCCESS,
    payload: resp,
});

// Go Button Post API
export const goButtonForMargin = (data) => ({
    type: GO_BUTTON_FOR_MARGIN_MASTER,
    data
});

export const goButtonForMarginSuccess = (resp) => ({
    type: GO_BUTTON_FOR_MARGIN_MASTER_SUCCESS,
    payload: resp,
});

// delete api Margin Master Page
export const deleteIdForMarginMaster = (id) => ({
    type: DELETE_ID_FOR_MARGIN_MASTER,
    id,
});

export const deleteIdForMarginMasterSuccess = (resp) => ({
    type: DELETE_ID_FOR_MARGIN_MASTER_SUCCESS,
    payload: resp,
});


export const MarginApiErrorAction = () => ({
    type: MARGIN_API_ERROR_ACTION,
})