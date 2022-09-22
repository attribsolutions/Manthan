import {
    GET_PRICE_LIST_DATA,
    GET_PRICE_LIST_DATA_SUCCESS,
    POST_PRICE_LIST_DATA,
    POST_PRICE_LIST_DATA_SUCCESS
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
// post api
export const getPriceListData = (partyType) => ({
    type: GET_PRICE_LIST_DATA,
    partyType,
});

export const getPriceListDataSuccess = (data) => ({
    type: GET_PRICE_LIST_DATA_SUCCESS,
    payload: data,
});