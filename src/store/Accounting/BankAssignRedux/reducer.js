import {
    SAVE_BANK_ASSIGN_SUCCESS,
    PARTY_BANK_FILTER_SUCCESS,
    EDIT_BANK_ASSIGN_ID_SUCCESS,
    UPDATE_BANK_ASSIGN_ID_SUCCESS
  } from "./actionType";
  
  const INIT_STATE = {
    postMsg: { Status: false },
    Data: [],
    editMsg: { Status: false },
    updateMessage: { Status: false },
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

            case EDIT_BANK_ASSIGN_ID_SUCCESS:
              return {
                ...state,
                editMsg: action.payload,
              };
        
            // update api
            case UPDATE_BANK_ASSIGN_ID_SUCCESS:
              return {
                ...state,
                updateMessage: action.payload,
              };
              

      default:
        return state
    }
  }
  
  export default BankAssignReducer  