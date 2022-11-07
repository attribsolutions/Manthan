import {
    GET_SUPPLIER_SUCCESS,
    POST_PARTYITEMS_SUCCESS,
    GO_BUTTON_FOR_PARTYITEMS_PAGE_SUCCESS,
  } from "./actionType"
  
  const INIT_STATE = {
    postMsg: { Status: false },
    supplier:[],
    itemName:[],
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
      case GO_BUTTON_FOR_PARTYITEMS_PAGE_SUCCESS:
      return {
        ...state,
        itemName: action.payload,
      }
        default:
            return state
        }
      }
      
      export default PartyItemsReducer