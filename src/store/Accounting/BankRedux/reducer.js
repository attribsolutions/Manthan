import {
    SAVE_BANK_MASTER_SUCCESS,
    GET_BANK_LIST_SUCCESS,
    DELETE_BANK_ID_SUCCESS,
    EDIT_BANK_ID_SUCCESS,
    UPDATE_BANK_ID_SUCCESS
  } from "./actionType";
  
  const INIT_STATE = {
    postMsg: { Status: false },
    BankList: [],
    deleteMessage: { Status: false },
    editMsg: { Status: false },
    updateMessage: { Status: false },
  }
  
  const BankReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case SAVE_BANK_MASTER_SUCCESS:
        return {
          ...state,
          postMsg: action.payload,
        }
  
      // post api
      case GET_BANK_LIST_SUCCESS:
        return {
          ...state,
          BankList: action.payload,
        }
  
      case DELETE_BANK_ID_SUCCESS:
        return {
          ...state,
          deleteMessage: action.payload,
        };
  
      case EDIT_BANK_ID_SUCCESS:
        return {
          ...state,
          editMsg: action.payload,
        };
  
      // update api
      case UPDATE_BANK_ID_SUCCESS:
        return {
          ...state,
          updateMessage: action.payload,
        };
        
      default:
        return state
    }
  }
  
  export default BankReducer  