import { UPDATE_PARTY_SUB_PARTY } from "./actionType";
import { SAVE_PARTY_SUB_PARTY } from "./actionType";
import {
  DELETE_ID_FOR_MASTER_PAGE_SUCCESS,
  DELETE_PARTY_SUB_PARTY_SUCCESS,
  EDIT_PARTY_SUB_PARTY_SUCCESS,
  GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN_SUCCESS,
  GET_PARTY_SUB_PARTY_LIST_SUCCESS,
  POST_PARTY_SUB_PARTY_SUCCESS,
  UPDATE_PARTY_SUB_PARTY_SUCCESS,

} from "./actionType";

const INIT_STATE = {
  listData: [],
  postMsg: { Status: false },
  editData: [],
  updateMsg: { Status: false },
  deleteMsg: { Status: false },
  PartySubParty: [],
  deleteState: [],
  saveBtnloading: false,
}

const PartySubPartyReducer = (state = INIT_STATE, action) => {
  switch (action.type) {


    case GET_PARTY_SUB_PARTY_LIST_SUCCESS:
      return {
        ...state,
        listData: action.payload,
      }

    case SAVE_PARTY_SUB_PARTY:
      return {
        ...state,
        saveBtnloading: true,
      }

    case POST_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false,

      }
    case EDIT_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case UPDATE_PARTY_SUB_PARTY:
      return {
        ...state,
        saveBtnloading: true,
      }

    case UPDATE_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        updateMsg: action.payload,
        saveBtnloading: false,

      }
    case DELETE_PARTY_SUB_PARTY_SUCCESS:
      return {
        ...state,
        deleteMsg: action.payload,
      }
    case GET_PARTY_SUB_PARTY_FOR_PARTY_DROPDOWN_SUCCESS:
      return {
        ...state,
        PartySubParty: action.payload,
      }
    case DELETE_ID_FOR_MASTER_PAGE_SUCCESS:
      return {
        ...state,
        deleteState: action.payload,
      }
    default:
      return state
  }
}

export default PartySubPartyReducer