import {
  SAVE_BANK_MASTER_SUCCESS,
  GET_BANK_LIST_SUCCESS,
  DELETE_BANK_ID_SUCCESS,
  EDIT_BANK_ID_SUCCESS,
  UPDATE_BANK_ID_SUCCESS,
  SAVE_BANK_MASTER,
  UPDATE_BANK_ID,
  EDIT_BANK_ID,
  GET_BANK_LIST,
  DELETE_BANK_ID
} from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
  BankList: [],
  deleteMessage: { Status: false },
  editMsg: { Status: false },
  updateMessage: { Status: false },
  saveBtnloading: false,
}

const BankReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SAVE_BANK_MASTER:
      return {
        ...state,
        saveBtnloading: true,
      }

    case SAVE_BANK_MASTER_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      }

    // get api

    case GET_BANK_LIST:
      return {
        ...state,
        listBtnLoading: true,
      }

    case GET_BANK_LIST_SUCCESS:
      return {
        ...state,
        BankList: action.payload,
        listBtnLoading: false,
      }


      case DELETE_BANK_ID:
        return {
          ...state,
          listBtnLoading: action.config.btnId,
          deleteMessage: action.payload,
        };

    case DELETE_BANK_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        deleteMessage: action.payload,
      };


      case EDIT_BANK_ID:
        return {
          ...state,
          listBtnLoading: action.config.btnId,
        };
  
  

    case EDIT_BANK_ID_SUCCESS:
      return {
        ...state,
        listBtnLoading: false,
        editMsg: action.payload,
      };


    // update api
    case UPDATE_BANK_ID:
      return {
        ...state,
        saveBtnloading: true,
      };

    case UPDATE_BANK_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
        saveBtnloading: false,
      };

    default:
      return state
  }
}

export default BankReducer  