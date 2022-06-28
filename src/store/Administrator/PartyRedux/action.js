import {
    DELETE_PARTY_ID, DELETE_PARTY_ID_SUCCESS,
    EDIT_PARTY_ID, EDIT_PARTY_ID_SUCCESS,
    GET_PARTY_LIST_API, GET_PARTY_LIST_API_SUCCESS,
    POST_PARTY_DATA, POST_PARTY_DATA_SUCCESS,
    UPDATE_PARTY_ID, UPDATE_PARTY_ID_SUCCESS
} from "./actionTypes";

// get api
export const getPartyListAPI = () => ({
    type: GET_PARTY_LIST_API,
});

export const getPartyListAPISuccess = (pages) => ({
    type: GET_PARTY_LIST_API_SUCCESS,
    payload: pages,
});

// post api
export const postPartyData = (Data, id) => ({
    type: POST_PARTY_DATA,
    Data, id
});

export const postPartyDataSuccess = (PartySaveSuccess) => ({
    type: POST_PARTY_DATA_SUCCESS,
    payload: PartySaveSuccess,
});

// delete api
export const deletePartyID = (id) => ({
    type: DELETE_PARTY_ID,
    id,

});
export const deletePartyIDSuccess = (deleteMessage) => ({
    type: DELETE_PARTY_ID_SUCCESS,
    payload: deleteMessage
});

// edit api
export const editPartyID = (ID) => ({
    type: EDIT_PARTY_ID,
    ID,
})
export const editPartyIDSuccess = (editData) => ({
    type: EDIT_PARTY_ID_SUCCESS,
    payload: editData,
})

// update api
export const updatePartyID = (updateData, ID) => ({
    type: UPDATE_PARTY_ID,
    updateData, ID,
})
export const updatePartyIDSuccess = (updateMessage) => ({
    type: UPDATE_PARTY_ID_SUCCESS,
    payload: updateMessage,
})

