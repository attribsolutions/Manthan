import {
    DELETE_GST_ID_FOR_MASTER,
    DELETE_GST_ID_FOR_MASTER_SUCCESS,
    DELETE_GST_LIST_ID,
    DELETE_GST_LIST_ID_SUCCESS,
    GET_GST_LIST,
    GET_GST_LIST_SUCCESS,
    GO_BUTTON_FOR_GST_MASTER,
    GO_BUTTON_FOR_GST_MASTER_SUCCESS,
    GST_API_ERROR_ACTION,
    POST_VIEW_GST,
    POST_VIEW_GST_SUCCESS,
    SAVE_GST_MASTER,
    SAVE_GST_MASTER_SUCCESS
} from "./actionType";

// post api
export const saveGSTMaster = (config = {}) => ({
    type: SAVE_GST_MASTER,
    config,
});

export const saveGSTMasterSuccess = (resp) => ({
    type: SAVE_GST_MASTER_SUCCESS,
    payload: resp,
});

//get listpage api
export const getGSTList = (config = {}) => ({
    type: GET_GST_LIST,
    config
});

export const getGSTListSuccess = (resp) => ({
    type: GET_GST_LIST_SUCCESS,
    payload: resp,
});

//delete for List Page
export const deleteGSTListId = (config = {}) => ({
    type: DELETE_GST_LIST_ID,
    config,
});

export const deleteGSTListId_Success = (resp) => ({
    type: DELETE_GST_LIST_ID_SUCCESS,
    payload: resp,
});

// Go Button Post API
export const goButtonForGST_Master = (data) => ({
    type: GO_BUTTON_FOR_GST_MASTER,
    data
});

export const goButtonForGST_Master_Success = (resp) => ({
    type: GO_BUTTON_FOR_GST_MASTER_SUCCESS,
    payload: resp,
});

// delete api GST Master Page
export const deleteGSTId_ForMaster = (id) => ({
    type: DELETE_GST_ID_FOR_MASTER,
    id,
});

export const postViewGst = (config = {}) => ({
    type: POST_VIEW_GST,
    config,
});

export const postViewGst_Success = (resp) => ({
    type: POST_VIEW_GST_SUCCESS,
    payload: resp,
});


export const deleteGSTId_ForMaster_Success = (resp) => ({
    type: DELETE_GST_ID_FOR_MASTER_SUCCESS,
    payload: resp,
});

export const GSTApiErrorAction = () => ({
    type: GST_API_ERROR_ACTION,
})
