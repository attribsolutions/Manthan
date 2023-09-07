import {
  SAVE_PARTY_ITEMS_ACTION,
  SAVE_PARTY_ITEMS_ACTION_SUCCESS,
  GO_BUTTON_PARTY_ITEM_ADD,
  GO_BUTTON_PARTY_ITEM_ADD_SUCCESS,
 
  EDIT_PARTY_ITEM_ID,
  EDIT_PARTY_ITEM_ID_SUCCESS,
  PARTY_ITEM_API_ERROR_ACTION,
} from "./actionType";



export const savePartyItemsAction = (config = {}) => ({            // save Action
  type: SAVE_PARTY_ITEMS_ACTION,
  config,
});

export const savePartyItemsActionSuccess = (resp) => ({    // Save  success
  type: SAVE_PARTY_ITEMS_ACTION_SUCCESS,
  payload: resp,
});

// Get Item List for Party Item Master *** Go Button API
export const goButtonPartyItemAddPage = (config) => ({   // After Supplier Select Item List API
  type: GO_BUTTON_PARTY_ITEM_ADD,
  config,
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