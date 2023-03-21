import {
  DELETE_PARTY_SUB_PARTY,
  DELETE_PARTY_SUB_PARTY_SUCCESS,
  EDIT_PARTY_SUB_PARTY,
  EDIT_PARTY_SUB_PARTY_SUCCESS,
  GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN,
  GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN_SUCCESS,
  GET_PARTY_SUB_PARTY_LIST,
  GET_PARTY_SUB_PARTY_LIST_SUCCESS,
  SAVE_PARTY_SUB_PARTY,
  POST_PARTY_SUB_PARTY_SUCCESS,
  UPDATE_PARTY_SUB_PARTY,
  UPDATE_PARTY_SUB_PARTY_SUCCESS,
  DELETE_ID_FOR_MASTER_PAGE,
  DELETE_ID_FOR_MASTER_PAGE_SUCCESS
} from "./actionType";



export const getPartySubPartylist = () => ({                                 // get List Api
  type: GET_PARTY_SUB_PARTY_LIST,
});

export const getPartySubPartylistSuccess = (list) => ({                          // get List success
  type: GET_PARTY_SUB_PARTY_LIST_SUCCESS,
  payload: list,
});

export const savePartySubParty = (config = {}) => ({                            // save Action
  type: SAVE_PARTY_SUB_PARTY,
  config,
});

export const savePartySubPartySuccess = (resp) => ({                             // Save  success
  type: POST_PARTY_SUB_PARTY_SUCCESS,
  payload: resp,
});

export const editPartySubParty = (config = {}) => ({                                      // Edit Action 
  type: EDIT_PARTY_SUB_PARTY,
  config,
})

export const editPartySubPartySuccess = (editData) => ({                              // Edit  Success
  type: EDIT_PARTY_SUB_PARTY_SUCCESS,
  payload: editData,
})

export const updatePartySubParty = (config = {}) => ({                              // update  Action
  type: UPDATE_PARTY_SUB_PARTY,
  config,
})

export const updatePartySubPartySuccess = (resp) => ({                              //Update Success
  type: UPDATE_PARTY_SUB_PARTY_SUCCESS,
  payload: resp,
})

export const getPartySubParty_For_party_dropdown = (id) => ({                     // get PartySubParty List in party dropdown
  type: GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN,
  id,
});

export const getPartySubParty_For_party_dropdownSuccess = (list) => ({           // get PartySubParty List in party dropdownSuccess
  type: GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN_SUCCESS,
  payload: list,
});

export const deletePartySubParty = (config = {}) => ({                          //Delete  Action
  type: DELETE_PARTY_SUB_PARTY,
  config,

});
export const deletePartySubPartySuccess = (resp) => ({                       // Delete Success
  type: DELETE_PARTY_SUB_PARTY_SUCCESS,
  payload: resp
});

export const deleteIDForMasterPage = (id) => ({                          //Delete  Action
  type: DELETE_ID_FOR_MASTER_PAGE,
  id,

});
export const deleteIDForMasterPageSuccess = (resp) => ({                       // Delete Success
  type: DELETE_ID_FOR_MASTER_PAGE_SUCCESS,
  payload: resp
});
