import {
    DELETE_GST_FOR_MASTER_PAGE,
    DELETE_GST_FOR_MASTER_PAGE_SUCCESS,
    DELETE_GST_LIST_PAGE,
    DELETE_GST_LIST_PAGE_SUCCESS,
    GET_GST_LIST_PAGE,
    GET_GST_LIST_PAGE_SUCCESS,
    POST_GO_BUTTON_FOR_GST_MASTER,
    POST_GO_BUTTON_FOR_GST_MASTER_SUCCESS,
    POST_GST_MASTER_DATA,
    POST_GST_MASTER_DATA_SUCCESS
} from "./actionType";

// post api
export const postGSTMasterData = (Data,) => ({
    type: POST_GST_MASTER_DATA,
    Data,
});

export const postGSTMasterDataSuccess = (data) => ({
    type: POST_GST_MASTER_DATA_SUCCESS,
    payload: data,
});

//get listpage api
export const getGSTListPage = () => ({
    type: GET_GST_LIST_PAGE,

});

export const getGSTListPageSuccess = (data) => ({
    type:GET_GST_LIST_PAGE_SUCCESS,
    payload: data,
});

//delete for List Page
export const deleteGSTListPage = (CommonID) => ({
    type: DELETE_GST_LIST_PAGE,
    CommonID,
});

export const deleteGSTListPageSuccess = (data) => ({
    type: DELETE_GST_LIST_PAGE_SUCCESS,
    payload: data,
});

// Go Button Post API
export const postGoButtonForGST_Master = (data) => ({
    type: POST_GO_BUTTON_FOR_GST_MASTER,
    data
});

export const postGoButtonForGST_Master_Success = (data) => ({
    type: POST_GO_BUTTON_FOR_GST_MASTER_SUCCESS,
    payload: data,
});

// delete api GST Master Page
export const deleteGSTForMasterPage = (id) => ({
    type: DELETE_GST_FOR_MASTER_PAGE,
    id,
});

export const deleteGSTForMasterPageSuccess = (data) => ({
    type: DELETE_GST_FOR_MASTER_PAGE_SUCCESS,
    payload: data,
});
