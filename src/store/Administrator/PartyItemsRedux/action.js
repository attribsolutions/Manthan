import {
  SAVE_PARTY_ITEMS_ACTION,
  SAVE_PARTY_ITEMS_ACTION_SUCCESS,
  GO_BUTTON_PARTY_ITEM_ADD,
  GO_BUTTON_PARTY_ITEM_ADD_SUCCESS,
  GET_PARTY_ITEM_ASSING_LIST,
  GET_PARTY_ITEM_ASSING_LIST_SUCCESS,
  EDIT_PARTY_ITEM_ID,
  EDIT_PARTY_ITEM_ID_SUCCESS,
  PARTY_ITEM_API_ERROR_ACTION,
} from "./actionType";

export const getPartyItemAssingList = (config) => ({
  type: GET_PARTY_ITEM_ASSING_LIST,
  config,
})


export const getPartyItemAssingListSuccess = (pages) => ({ 
  type: GET_PARTY_ITEM_ASSING_LIST_SUCCESS,
  payload: pages,
});

export const savePartyItemsAction = (config = {}) => ({            // save Action
  type: SAVE_PARTY_ITEMS_ACTION,
  config,
});

export const savePartyItemsActionSuccess = (resp) => ({    // Save  success
  type: SAVE_PARTY_ITEMS_ACTION_SUCCESS,
  payload: resp,
});

// Get Item List for Party Item Master *** Go Button API
export const goButtonPartyItemAddPage = (jsonBody,subPageMode) => ({   // After Supplier Select Item List API
  type: GO_BUTTON_PARTY_ITEM_ADD,
  jsonBody,subPageMode
});

export const goButtonPartyItemAddPageSuccess = data => ({        // After Supplier Select Item List API success
  type: GO_BUTTON_PARTY_ITEM_ADD_SUCCESS,
  payload: data,
})

// edit api
export const editPartyItemID = (body, config) => ({      // Edit Action 
  type: EDIT_PARTY_ITEM_ID,
  body, config
});

export const editPartyItemIDSuccess = (editData) => ({       // Edit  Success
  type: EDIT_PARTY_ITEM_ID_SUCCESS,
  payload: editData,
});

export const PartyItemApiErrorAction = () => ({
  type: PARTY_ITEM_API_ERROR_ACTION,
})