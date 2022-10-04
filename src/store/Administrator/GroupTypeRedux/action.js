import {
    DELETE_GROUP_TYPE_ID,
    DELETE_GROUP_TYPE_ID_SUCCESS,
    EDIT_GROUP_TYPE_ID,
    EDIT_GROUP_TYPE_ID_SUCCESS,
    GET_GROUP_TYPES_LIST,
    GET_GROUP_TYPES_LIST_SUCCESS,
    POST_GROUP_TYPE_SUBMIT,
    POST_GROUP_TYPE_SUBMIT_SUCCESS,
    UPDATE_GROUP_TYPE_ID,
    UPDATE_GROUP_TYPE_ID_SUCCESS
} from "./actionType";

// get GroupTypes list 
export const getGroupTypeslist = () => ({
    type: GET_GROUP_TYPES_LIST,
});

export const getGroupTypeslistSuccess = (pages) => ({
    type: GET_GROUP_TYPES_LIST_SUCCESS,
    payload: pages,
});

// post api
export const PostGroupTypeSubmit = (data) => ({
    type: POST_GROUP_TYPE_SUBMIT,
    data,
});

export const PostGroupTypeSubmitSuccess = (data) => ({
    type: POST_GROUP_TYPE_SUBMIT_SUCCESS,
    payload: data,
});

// edit api
export const editGroupTypeId = (id, pageMode) => ({
    type: EDIT_GROUP_TYPE_ID,
    id, pageMode
})
export const editGroupTypeIdSuccess = (editData) => ({
    type: EDIT_GROUP_TYPE_ID_SUCCESS,
    payload: editData,
})

// update api
export const updateGroupTypeID = (updateData, ID) => ({
    type: UPDATE_GROUP_TYPE_ID,
    updateData, ID,
})
export const updateGroupTypeIDSuccess = (updateMessage) => ({
    type: UPDATE_GROUP_TYPE_ID_SUCCESS,
    payload: updateMessage,
})

//delete api
export const deleteGroupType_ID = (id) => ({
    type: DELETE_GROUP_TYPE_ID,
    id,

});
export const deleteGroupType_IDSuccess = (deleteMessage) => ({
    type: DELETE_GROUP_TYPE_ID_SUCCESS,
    payload: deleteMessage
});
