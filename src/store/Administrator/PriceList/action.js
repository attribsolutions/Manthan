import {
    DELETE_PRICE_LIST,
    DELETE_PRICE_LIST_SUCCESS,
    GET_PRICE_LIST_DATA,
    GET_PRICE_LIST_DATA_SUCCESS,
    POST_PRICE_LIST_DATA,
    POST_PRICE_LIST_DATA_SUCCESS,
    EDIT_PRICE_LIST,
    EDIT_PRICE_LIST_SUCCESS,
    UPDATE_PRICE_LIST,
    UPDATE_PRICE_LIST_SUCCESS,
    GET_PRICE_LIST_PAGE,
    GET_PRICE_LIST_PAGE_SUCCESS
} from "./actionType";

// post api
export const postPriceListData = (Data,) => ({
    type: POST_PRICE_LIST_DATA,
    Data, 
});

export const postPriceListDataSuccess = (data,id) => ({
    type: POST_PRICE_LIST_DATA_SUCCESS,
    payload: data,
});

// get api 
export const getPriceListData = (partyType) => ({
    type: GET_PRICE_LIST_DATA,
    partyType,
});

export const getPriceListDataSuccess = (data) => ({
    type: GET_PRICE_LIST_DATA_SUCCESS,
    payload: data,
});

 //get listpage api
export const getPriceListPage = () => ({
    type: GET_PRICE_LIST_PAGE,
    
});

export const getPriceListPageSuccess = (data) => ({
    type: GET_PRICE_LIST_PAGE_SUCCESS,
    payload: data,
});

//delete
export const delete_PriceList = (id) => ({
    type: DELETE_PRICE_LIST,
    id,
});

export const delete_PriceListSuccess = (data) => ({
    type: DELETE_PRICE_LIST_SUCCESS,
    payload: data,
});

//edit api
export const editPriceList = (id,pageMode) => ({
 type: EDIT_PRICE_LIST,
 id,pageMode
})
export const editPriceListSuccess = (editData) => ({
 type: EDIT_PRICE_LIST_SUCCESS,
 
 payload: editData,
})

// update api
export const updatePriceList = (updateData, ID) => ({
 type: UPDATE_PRICE_LIST,
 updateData, ID,
})
export const updatePriceListSuccess = (updateMessage) => ({
 type: UPDATE_PRICE_LIST_SUCCESS,
 payload: updateMessage,
})

