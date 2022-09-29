import { POST_MARGIN_MASTER_DATA,
     POST_MARGIN_MASTER_DATA_SUCCESS,
     GET_MARGIN_LIST_PAGE,
     GET_MARGIN_LIST_PAGE_SUCCESS,
     DELETE_MARGIN_LIST_PAGE,
     DELETE_MARGIN_LIST_PAGE_SUCCESS,
     EDIT_MARGIN_LIST_PAGE,
     EDIT_MARGIN_LIST_PAGE_SUCCESS,
     UPDATE_MARGIN_LIST_PAGE,
     UPDATE_MARGIN_LIST_PAGE_SUCCESS
    } from "./actionType";

// post api
export const postMarginMasterData = (Data,) => ({
    type: POST_MARGIN_MASTER_DATA,
    Data, 
});

export const postMarginMasterDataSuccess = (data) => ({
    type: POST_MARGIN_MASTER_DATA_SUCCESS,
    payload: data,
});


//get listpage api
export const getMarginListPage = () => ({
    type: GET_MARGIN_LIST_PAGE,

});

export const getMarginListPageSuccess = (data) => ({
    type: GET_MARGIN_LIST_PAGE_SUCCESS,
    payload: data,
});

//delete
export const delete_MarginList = (id) => ({
    type: DELETE_MARGIN_LIST_PAGE,
    id,
});

export const delete_MarginListSuccess = (data) => ({
    type: DELETE_MARGIN_LIST_PAGE_SUCCESS,
    payload: data,
});

//edit api
export const editMarginList = (id, pageMode) => ({
    type: EDIT_MARGIN_LIST_PAGE,
    id, pageMode
})
export const editMarginListSuccess = (editData) => ({
    type: EDIT_MARGIN_LIST_PAGE_SUCCESS,

    payload: editData,
})

// update api
export const updateMarginList = (updateData, ID) => ({
    type: UPDATE_MARGIN_LIST_PAGE,
    updateData, ID,
})
export const updateMarginListSuccess = (updateMessage) => ({
    type: UPDATE_MARGIN_LIST_PAGE_SUCCESS,
    payload: updateMessage,
})