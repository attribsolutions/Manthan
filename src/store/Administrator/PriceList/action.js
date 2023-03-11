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
export const savePriceMasterAction = (config) => ({
    type: POST_PRICE_LIST_DATA,
    config,
});

export const savePriceMasterActionSuccess = (resp) => ({
    type: POST_PRICE_LIST_DATA_SUCCESS,
    payload: resp,
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
export const delete_PriceList = (config) => ({
    type: DELETE_PRICE_LIST,
    config,
});

export const delete_PriceListSuccess = (resp) => ({
    type: DELETE_PRICE_LIST_SUCCESS,
    payload: resp,
});

//edit api
export const editPriceList = (config) => ({
    type: EDIT_PRICE_LIST,
    config,
})
export const editPriceListSuccess = (resp) => ({
    type: EDIT_PRICE_LIST_SUCCESS,

    payload: resp,
})

// update api
export const updatePriceList = (config) => ({
    type: UPDATE_PRICE_LIST,
    config,
})
export const updatePriceListSuccess = (resp) => ({
    type: UPDATE_PRICE_LIST_SUCCESS,
    payload: resp,
})

