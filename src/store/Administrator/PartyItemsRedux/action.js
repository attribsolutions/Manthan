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

export const PostPartyItems = (data) => ({
  type: POST_PARTYITEMS,
  data,
});

export const PostPartyItemsSuccess = (data) => ({
  type: POST_PARTYITEMS_SUCCESS,
  payload: data,
});

// For List Page
export const GetPartyList = () => ({
  type: GET_PARTY_LIST,
})
export const getPartyListSuccess = (pages) => ({
  type: GET_PARTY_LIST_SUCCESS,
  payload: pages,
});

// After Supplier Select Item List API
export const getpartyItemList = (supplierId) => ({
  type: GET_PARTY_ITEM_LIST,
  supplierId
});

export const getPartyItemListSuccess = data => ({
  type: GET_PARTY_ITEM_LIST_SUCCESS,
  payload: data,
})

//Edit Party Items Using Id
export const editPartyItemID = (id,pageMode) => ({
  type: EDIT_PARTY_ITEM_ID,
  id,pageMode
});
export const editPartyItemIDSuccess = (editData) => ({
  type: EDIT_PARTY_ITEM_ID_SUCCESS,
  payload: editData,
});
