import {
    SAVE_BANK_ASSIGN_SUCCESS,
    PARTY_BANK_FILTER_SUCCESS
  } from "./actionType";
  
  const INIT_STATE = {
    postMsg: { Status: false },
    Data: [],
    
  }
  
  const BankAssignReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case SAVE_BANK_ASSIGN_SUCCESS:
        return {
          ...state,
          postMsg: action.payload,
        }
   
        case PARTY_BANK_FILTER_SUCCESS:
            return {
                ...state,
                Data: action.payload,
            }

      default:
        return state
    }
  }
  
  export default BankAssignReducer  