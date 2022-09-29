

import {
    POST_GO_BUTTON_DATA,
    POST_GO_BUTTON_DATA_SUCCESS,
    POST_MRP_MASTER_DATA,
    POST_MRP_MASTER_DATA_SUCCESS,
    GET_MRP_LIST_PAGE,
    GET_MRP_LIST_PAGE_SUCCESS,
    DELETE_MRP_LIST_PAGE,
    DELETE_MRP_LIST_PAGE_SUCCESS,
    EDIT_MRP_LIST_PAGE,
    EDIT_MRP_LIST_PAGE_SUCCESS,
    UPDATE_MRP_LIST_PAGE,
    UPDATE_MRP_LIST_PAGE_SUCCESS,

} from "./actionTypes";


// MRP Post API
export const postMRPMasterData = (Data,) => ({
    type: POST_MRP_MASTER_DATA,
    Data,
});

export const postMRPMasterDataSuccess = (data) => ({
    type: POST_MRP_MASTER_DATA_SUCCESS,
    payload: data,
});


// Go Button Post API
export const postGoButtonData = (data,) => ({
    type: POST_GO_BUTTON_DATA,
    data,
});

export const postGoButtonDataSuccess = (data) => ({
    type: POST_GO_BUTTON_DATA_SUCCESS,
    payload: data,
});

//get listpage api
export const getMRPListPage = () => ({
    type: GET_MRP_LIST_PAGE,

});

export const getMRPListPageSuccess = (data) => ({
    type: GET_MRP_LIST_PAGE_SUCCESS,
    payload: data,
});

//delete
export const delete_MRPList = (id) => ({
    type: DELETE_MRP_LIST_PAGE,
    id,
});

export const delete_MRPListSuccess = (data) => ({
    type: DELETE_MRP_LIST_PAGE_SUCCESS,
    payload: data,
});

//edit api
export const editMRPList = (id, pageMode) => ({
    type: EDIT_MRP_LIST_PAGE,
    id, pageMode
})
export const editMRPListSuccess = (editData) => ({
    type: EDIT_MRP_LIST_PAGE_SUCCESS,

    payload: editData,
})

// update api
export const updateMRPList = (updateData, ID) => ({
    type: UPDATE_MRP_LIST_PAGE,
    updateData, ID,
})
export const updateMRPListSuccess = (updateMessage) => ({
    type: UPDATE_MRP_LIST_PAGE_SUCCESS,
    payload: updateMessage,
})

