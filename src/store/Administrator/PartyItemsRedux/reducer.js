import {
  EDIT_PARTY_ITEM_ID_SUCCESS,
  GET_PARTY_ITEM_LIST_SUCCESS,
  GET_PARTY_LIST_SUCCESS,
  PARTY_ITEM_API_ERROR_ACTION,
  POST_PARTYITEMS,
  POST_PARTYITEMS_SUCCESS,
} from "./actionType"
const INIT_STATE = {

  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  partyItem: [],
  partyList: [],
  saveBtnloading: false
}

const PartyItemsReducer = (state = INIT_STATE, action) => {

  switch (action.type) {

    case POST_PARTYITEMS:
      return {
        ...state,
        saveBtnloading: true
      }

    case POST_PARTYITEMS_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        saveBtnloading: false

      }

    case GET_PARTY_LIST_SUCCESS:
      return {
        ...state,
        partyList: action.payload,
      }

    case GET_PARTY_ITEM_LIST_SUCCESS:
      return {
        ...state,
        partyItem: action.payload,
      }

    case EDIT_PARTY_ITEM_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      }

    case PARTY_ITEM_API_ERROR_ACTION:
      return {
        ...state,
        saveBtnloading: false
      }

    default:
      return state
  }
}

export default PartyItemsReducer