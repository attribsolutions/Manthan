import {
  DELETE_PARTY_SUB_PARTY,
  DELETE_PARTY_SUB_PARTY_SUCCESS,
  EDIT_PARTY_SUB_PARTY,
  EDIT_PARTY_SUB_PARTY_SUCCESS,
  GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN,
  GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN_SUCCESS,
  GET_PARTY_SUB_PARTY_LIST,
  GET_PARTY_SUB_PARTY_LIST_SUCCESS,
  POST_PARTY_SUB_PARTY,
  POST_PARTY_SUB_PARTY_SUCCESS,
  UPDATE_PARTY_SUB_PARTY,
  UPDATE_PARTY_SUB_PARTY_SUCCESS
} from "./actionType";

export const postPartySubParty = (data) => ({
  type: POST_PARTY_SUB_PARTY,
  data,
});

export const postPartySubPartySuccess = (data) => ({
  type: POST_PARTY_SUB_PARTY_SUCCESS,
  payload: data,
});

// get Product Category Type list 
export const getPartySubPartylist = () => ({
  type: GET_PARTY_SUB_PARTY_LIST,
});

export const getPartySubPartylistSuccess = (list) => ({
  type: GET_PARTY_SUB_PARTY_LIST_SUCCESS,
  payload: list,
});

////delete api
export const deletePartySubParty = (id) => ({
  type: DELETE_PARTY_SUB_PARTY,
  id,

});
export const deletePartySubPartySuccess = (msg) => ({
  type: DELETE_PARTY_SUB_PARTY_SUCCESS,
  payload: msg
});

// edit api
export const editPartySubParty = (id, pageMode) => ({
  type: EDIT_PARTY_SUB_PARTY,
  id, pageMode
})

export const editPartySubPartySuccess = (editData) => ({
  type: EDIT_PARTY_SUB_PARTY_SUCCESS,
  payload: editData,
})

// update api
export const updatePartySubParty = (updateData, ID) => ({
  type: UPDATE_PARTY_SUB_PARTY,
})

export const updatePartySubPartySuccess = (msg) => ({
  type: UPDATE_PARTY_SUB_PARTY_SUCCESS,
  payload: msg,
})

// get PartySubParty List in party dropdown
export const getPartySubParty_For_party_dropdown = (id) => ({
  type: GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN,
  id,
});

export const getPartySubParty_For_party_dropdownSuccess = (list) => ({
  type: GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN_SUCCESS,
  payload: list,
});
