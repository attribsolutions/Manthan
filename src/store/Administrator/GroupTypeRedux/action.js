import {
    DELETE_GROUP_TYPE_ID,
    DELETE_GROUP_TYPE_ID_SUCCESS,
    EDIT_GROUP_TYPE_ID,
    EDIT_GROUP_TYPE_ID_SUCCESS,
    GET_GROUP_TYPES_LIST,
    GET_GROUP_TYPES_LIST_SUCCESS,
    SAVE_GROUP_TYPE_MASTER,
    SAVE_GROUP_TYPE_MASTER_SUCCESS,
    UPDATE_GROUP_TYPE_ID,
    UPDATE_GROUP_TYPE_ID_SUCCESS,
    GROUP_TYPE_API_ERROR_ACTION
} from "./actionType";

export const getGroupTypeslist = () => ({// get List Action
    type: GET_GROUP_TYPES_LIST,
});

export const getGroupTypeslistSuccess = (pages) => ({// get List success
    type: GET_GROUP_TYPES_LIST_SUCCESS,
    payload: pages,
});

export const saveGroupTypeMaster = (config = {}) => ({// save Action
    type: SAVE_GROUP_TYPE_MASTER,
    config,
});

export const saveGroupTypeMasterSuccess = (resp) => ({// Save  success
    type: SAVE_GROUP_TYPE_MASTER_SUCCESS,
    payload: resp,
});

export const editGroupTypeID = (config = {}) => ({// Edit Action 
    type: EDIT_GROUP_TYPE_ID,
    config,
})
export const editGroupTypeIDSuccess = (resp) => ({// Edit  Success
    type: EDIT_GROUP_TYPE_ID_SUCCESS,
    payload: resp,
})

export const updateGroupTypeID = (config = {}) => ({// update  Action
    type: UPDATE_GROUP_TYPE_ID,
    config,
})
export const updateGroupTypeIDSuccess = (resp) => ({//Update Success
    type: UPDATE_GROUP_TYPE_ID_SUCCESS,
    payload: resp,
})

export const deleteGroupTypeID = (config = {}) => ({// Delete  Action
    type: DELETE_GROUP_TYPE_ID,
    config,
});

export const deleteGroupTypeIDSuccess = (resp) => ({// Delete Success
    type: DELETE_GROUP_TYPE_ID_SUCCESS,
    payload: resp
});

export const GroupTypeApiErrorAction = () => ({
    type: GROUP_TYPE_API_ERROR_ACTION,
})
