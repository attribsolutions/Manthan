import {
    POST_PARTYITEMS,
    POST_PARTYITEMS_SUCCESS,
    GET_SUPPLIER_SUCCESS,
    GET_SUPPLIER,
    GO_BUTTON_FOR_PARTYITEMS_PAGE_SUCCESS,
    GO_BUTTON_FOR_PARTYITEMS_PAGE,
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
  })
  
  
  export const goButton = data => ({
    type: GO_BUTTON_FOR_PARTYITEMS_PAGE,
    data,
  });
  
  export const goButtonSuccess = list => ({
    type: GO_BUTTON_FOR_PARTYITEMS_PAGE_SUCCESS,
    payload: list,
  })
  