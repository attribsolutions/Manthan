import {

    GET_SCHEME_TYPE_LIST,
    SCHEME_TYPE_ERROR_ACTION,
    DELETE_SCHEME_TYPE_ID_SUCCESS,
    DELETE_SCHEME_TYPE_ID,
    UPDATE_SCHEME_TYPE_ID_SUCCESS,
    UPDATE_SCHEME_TYPE_ID,
    EDIT_SCHEME_TYPE_ID_SUCCESS,
    EDIT_SCHEME_TYPE_ID,
    SAVE_SCHEME_TYPE_SUCCESS,
    SAVE_SCHEME_TYPE_MASTER,
    GET_SCHEME_TYPE_LIST_SUCCESS,
    VALIDE_SCHEME_TYPE_ID,
    VALIDE_SCHEME_TYPE_ID_SUCCESS
} from "./actionType";

export const getSchemeTypelist = () => ({// get List Action
    type: GET_SCHEME_TYPE_LIST,

});

export const getSchemeTypelistSuccess = (pages) => ({// get List success
    type: GET_SCHEME_TYPE_LIST_SUCCESS,
    payload: pages,
});

export const saveSchemeType = (config = {}) => ({// save Action
    type:  SAVE_SCHEME_TYPE_MASTER,
    config,
});

export const saveSchemeTypeSuccess = (resp) => ({// Save  success
    type:  SAVE_SCHEME_TYPE_SUCCESS,
    payload: resp,
});

export const editSchemeTypeID = (config = {}) => ({// Edit Action 
    type:  EDIT_SCHEME_TYPE_ID,
    config,
})
export const editSchemeTypeIDSuccess = (resp) => ({// Edit  Success
    type:  EDIT_SCHEME_TYPE_ID_SUCCESS,
    payload: resp,
})

export const ValideSchemeTypeID = (config = {}) => ({// Edit Action 
    type:  VALIDE_SCHEME_TYPE_ID,
    config,
})
export const ValideSchemeTypeIDSuccess = (resp) => ({// Edit  Success
    type:  VALIDE_SCHEME_TYPE_ID_SUCCESS,
    payload: resp,
})

export const updateSchemeTypeID = (config = {}) => ({// update  Action
    type: UPDATE_SCHEME_TYPE_ID,
    config,
})
export const updateSchemeTypeIDSuccess = (resp) => ({//Update Success
    type: UPDATE_SCHEME_TYPE_ID_SUCCESS,
    payload: resp,
})

export const deleteSchemeTypeID = (config = {}) => ({// Delete  Action
    type:  DELETE_SCHEME_TYPE_ID,
    config,
});

export const deleteSchemeTypeIDSuccess = (resp) => ({// Delete Success
    type:  DELETE_SCHEME_TYPE_ID_SUCCESS,
    payload: resp
});

export const SchemeTypeErrorAction = () => ({
    type:  SCHEME_TYPE_ERROR_ACTION,
})
