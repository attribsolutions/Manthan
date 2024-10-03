import {
    COUNTRY_API_ERROR_ACTION,
    DELETE_COUNTRY_ID_ACTION,
    DELETE_COUNTRY_ID_SUCCESS,
    EDIT_COUNTRY_ID_ACTION,
    EDIT_COUNTRY_ID_SUCCESS,
    GET_COUNTRY_LIST_ACTION,
    GET_COUNTRY_LIST_SUCCESS,
    SAVE_COUNTRY_MASTER_ACTION,
    SAVE_COUNTRY_MASTER_SUCCESS,
    UPDATE_COUNTRY_ID_ACTION,
    UPDATE_COUNTRY_ID_SUCCESS
} from "./actionType";

export const getCountryList_Action = () => ({ //get action
    type: GET_COUNTRY_LIST_ACTION,
});

export const getCountryList_Success = (resp) => ({ // get Success
    type: GET_COUNTRY_LIST_SUCCESS,
    payload: resp,
});

export const saveCountryMaster_Action = (config = {}) => ({ // post action
    type: SAVE_COUNTRY_MASTER_ACTION,
    config,
});

export const saveCountryMaster_Success = (resp) => ({ // post success
    type: SAVE_COUNTRY_MASTER_SUCCESS,
    payload: resp,
});

export const editCountry_ID_Action = (config = {}) => ({// edit action
    type: EDIT_COUNTRY_ID_ACTION,
    config,
})

export const editCountry_ID_Success = (resp) => ({ // edit success
    type: EDIT_COUNTRY_ID_SUCCESS,
    payload: resp,
})

export const updateCountry_ID_Action = (config = {}) => ({ // update action
    type: UPDATE_COUNTRY_ID_ACTION,
    config,
})

export const updateCountry_ID_Success = (resp) => ({ // update success
    type: UPDATE_COUNTRY_ID_SUCCESS,
    payload: resp,
})

export const deleteCountry_ID_Action = (config = {}) => ({ // delete action
    type: DELETE_COUNTRY_ID_ACTION,
    config,
});

export const deleteCountry_ID_Success = (resp) => ({// delete success
    type: DELETE_COUNTRY_ID_SUCCESS,
    payload: resp
});

export const CountryApiError_Action = () => ({
    type: COUNTRY_API_ERROR_ACTION,
})
