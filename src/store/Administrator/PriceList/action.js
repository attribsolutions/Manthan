import {
    DELETE_PRICE_LIST,
    DELETE_PRICE_LIST_SUCCESS,
    PRICE_LIST_BY_PARTY_ACTION,
    PRICE_LIST_BY_PARTY_ACTION_SUCCESS,
    POST_PRICE_LIST_DATA,
    POST_PRICE_LIST_DATA_SUCCESS,
    EDIT_PRICE_LIST,
    EDIT_PRICE_LIST_SUCCESS,
    UPDATE_PRICE_LIST,
    UPDATE_PRICE_LIST_SUCCESS,
    GET_PRICE_LIST_PAGE,
    GET_PRICE_LIST_PAGE_SUCCESS,
    PRICE_LIST_BY_COMPANY,
    PRICE_LIST_BY_COMPANY_SUCCESS
} from "./actionType";




export const priceListByPartyAction = (partyType) => ({// priceMaster Gobtn
    type: PRICE_LIST_BY_PARTY_ACTION,
    partyType,
});

export const priceListByPartyActionSuccess = (data) => ({// priceMaster Gobtn Success
    type: PRICE_LIST_BY_PARTY_ACTION_SUCCESS,
    payload: data,
});


export const getPriceListPage = () => ({// listpage api
    type: GET_PRICE_LIST_PAGE,

});

export const getPriceListPageSuccess = (data) => ({// listpage Success
    type: GET_PRICE_LIST_PAGE_SUCCESS,
    payload: data,
});



export const savePriceMasterAction = (config) => ({// save api
    type: POST_PRICE_LIST_DATA,
    config,
});

export const savePriceMasterActionSuccess = (resp) => ({// save success
    type: POST_PRICE_LIST_DATA_SUCCESS,
    payload: resp,
});

export const delete_PriceList = (config) => ({//delete Api
    type: DELETE_PRICE_LIST,
    config,
});

export const delete_PriceListSuccess = (resp) => ({ //delete Success
    type: DELETE_PRICE_LIST_SUCCESS,
    payload: resp,
});


export const editPriceList = (config) => ({//edit api
    type: EDIT_PRICE_LIST,
    config,
})
export const editPriceListSuccess = (resp) => ({//edit success
    type: EDIT_PRICE_LIST_SUCCESS,
    payload: resp,
})


export const updatePriceList = (config) => ({// update api
    type: UPDATE_PRICE_LIST,
    config,
})
export const updatePriceListSuccess = (resp) => ({// update  Success
    type: UPDATE_PRICE_LIST_SUCCESS,
    payload: resp,
})


export const priceListByCompay_Action = (companyId) => ({
    type: PRICE_LIST_BY_COMPANY,
    companyId,
})
export const priceListByCompay_ActionSuccess = (resp) => ({
    type: PRICE_LIST_BY_COMPANY_SUCCESS,
    payload: resp,
})
