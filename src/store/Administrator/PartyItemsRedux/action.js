import {
  POST_PARTYITEMS,
  POST_PARTYITEMS_SUCCESS,
  GET_SUPPLIER_SUCCESS,
  GET_SUPPLIER,
  GET_PARTY_ITEM_LIST,
  GET_PARTY_ITEM_LIST_SUCCESS,
  GET_PARTY_LIST,
  GET_PARTY_LIST_SUCCESS,
} from "./actionType";

export const PostPartyItems = (data) => ({
  type: POST_PARTYITEMS,
  data,
});

export const PostPartyItemsSuccess = (data) => ({
  type: POST_PARTYITEMS_SUCCESS,
  payload: data,
});

export const getSupplier = () => ({
  type: GET_SUPPLIER,
});

export const getSupplierSuccess = items => ({
  type: GET_SUPPLIER_SUCCESS,
  payload: items,
});


export const GetPartyList = () => ({
  type: GET_PARTY_LIST,
})
export const getPartyListSuccess = (pages) => ({
  type: GET_PARTY_LIST_SUCCESS,
  payload: pages,
});


export const getpartyItemList = (supplierId) => ({
  type: GET_PARTY_ITEM_LIST,
  supplierId
});

export const getPartyItemListSuccess = data => ({
  type: GET_PARTY_ITEM_LIST_SUCCESS,
  payload: data,
})
