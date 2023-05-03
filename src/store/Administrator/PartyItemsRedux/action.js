import {
  POST_PARTYITEMS,
  POST_PARTYITEMS_SUCCESS,
  GET_PARTY_ITEM_LIST,
  GET_PARTY_ITEM_LIST_SUCCESS,
  GET_PARTY_LIST,
  GET_PARTY_LIST_SUCCESS,
  EDIT_PARTY_ITEM_ID,
  EDIT_PARTY_ITEM_ID_SUCCESS,
} from "./actionType";

export const GetPartyList = () => ({    // get List Action
  type: GET_PARTY_LIST,
})

export const getPartyListSuccess = (pages) => ({  // get List success
  type: GET_PARTY_LIST_SUCCESS,
  payload: pages,
});

export const SavePartyItems = (config = {}) => ({            // save Action
  type: POST_PARTYITEMS,
  config,
});

export const SavePartyItemsSuccess = (resp) => ({    // Save  success
  type: POST_PARTYITEMS_SUCCESS,
  payload: resp,
});

// Get Item List for Party Item Master
export const getpartyItemList = (jsonBody) => ({   // After Supplier Select Item List API
  type: GET_PARTY_ITEM_LIST,
  jsonBody,
});

export const getPartyItemListSuccess = data => ({        // After Supplier Select Item List API success
  type: GET_PARTY_ITEM_LIST_SUCCESS,
  payload: data,
})

export const editPartyItemID = (body, config) => ({      // Edit Action 
  type: EDIT_PARTY_ITEM_ID,
  body, config
});

export const editPartyItemIDSuccess = (editData) => ({       // Edit  Success
  type: EDIT_PARTY_ITEM_ID_SUCCESS,
  payload: editData,
});
