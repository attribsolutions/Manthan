import {
  EDIT_PARTY_ITEM_ID_SUCCESS,
  GET_PARTY_ITEM_LIST_SUCCESS,
  GET_PARTY_LIST_SUCCESS,
  POST_PARTYITEMS_SUCCESS,
} from "./actionType"
const INIT_STATE = {

  postMsg: { Status: false },
  deleteMsg: { Status: false },
  editData: { Status: false },
  updateMsg: { Status: false },
  partyItem: [],
  partyList: []
}

const PartyItemsReducer = (state = INIT_STATE, action) => {

  switch (action.type) {

    case POST_PARTYITEMS_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
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
    default:
      return state
  }
}

export default PartyItemsReducer