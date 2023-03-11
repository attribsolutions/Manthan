import {
  DELETE_PARTY_TYPE_ID,
  DELETE_PARTY_TYPE_ID_SUCCESS,
  EDIT_PARTY_TYPE_ID,
  EDIT_PARTY_TYPE_ID_SUCCESS,
  GET_PARTY_TYPE_LIST,
  GET_PARTY_TYPE_LIST_SUCCESS,
  POST_PARTY_TYPE_API,
  POST_PARTY_TYPE_API_SUCCESS,
  UPDATE_PARTY_TYPE_ID,
  UPDATE_PARTY_TYPE_ID_SUCCESS
} from "./actionTypes";

export const PostPartyTypeAPI = (data) => ({
  type: POST_PARTY_TYPE_API,
  data,
});

export const PostPartyTypeAPISuccess = (data) => ({
  type: POST_PARTY_TYPE_API_SUCCESS,
  payload: data,
});

/// get Empoyee list 
export const getPartyTypelist = () => ({
  type: GET_PARTY_TYPE_LIST,
});

export const getPartyTypelistSuccess = (pages) => ({
  type: GET_PARTY_TYPE_LIST_SUCCESS,
  payload: pages,
});

////delete api
export const delete_PartyType_ID = (id) => ({
  type: DELETE_PARTY_TYPE_ID,
  id,

});
export const deletePartyTypeIDSuccess = (deleteMessage) => ({
  type: DELETE_PARTY_TYPE_ID_SUCCESS,
  payload: deleteMessage
});

// edit api
export const editPartyTypeId = (id,pageMode) => ({
  type: EDIT_PARTY_TYPE_ID,
  id,pageMode
})
export const editPartyTypeSuccess = (editData) => ({
  type: EDIT_PARTY_TYPE_ID_SUCCESS,
  payload: editData,
})

// update api
export const updatePartyTypeID = (updateData, ID) => ({
  type: UPDATE_PARTY_TYPE_ID,
  updateData, ID,
})
export const updatePartyTypeIDSuccess = (updateMessage) => ({
  type: UPDATE_PARTY_TYPE_ID_SUCCESS,
  payload: updateMessage,
})