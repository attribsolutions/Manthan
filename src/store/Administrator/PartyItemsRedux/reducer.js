import {
  GET_PARTY_ITEM_LIST_SUCCESS,
    GET_SUPPLIER_SUCCESS,
    POST_PARTYITEMS_SUCCESS,
  } from "./actionType"
  const INIT_STATE = {
    
    postMsg: { Status: false },
    supplier:[],
    partyItem:[],
  }
  
  const PartyItemsReducer = (state = INIT_STATE, action) => {
  
    switch (action.type) {
  
      case POST_PARTYITEMS_SUCCESS:
        return {
          ...state,
          postMsg: action.payload,
        }
        case GET_SUPPLIER_SUCCESS:
      return {
        ...state,
        supplier: action.payload,
      }
      case GET_PARTY_ITEM_LIST_SUCCESS:
      return {
        ...state,
        partyItem: action.payload,
      }
        default:
            return state
        }
      }
      
      export default PartyItemsReducer