import * as actionType from "./actionTypes";

const INIT_STATE = {
  PostData: { Status: false },
  ListData: [],
  deleteMessage: { Status: false },
  editData: { Status: false },
  updateMessage: { Status: false },
}

const PartyTypeReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case actionType.SAVE_PARTY_TYPE_API_SUCCESS:
      return {
        ...state,
        PostData: action.payload,
      }

    case actionType.GET_PARTY_TYPE_LIST_SUCCESS:
      return {
        ...state,
        ListData: action.payload,
      }

    case actionType.DELETE_PARTY_TYPE_ID_SUCCESS:
      return {
        ...state,
        deleteMessage: action.payload,
      };

    case actionType.EDIT_PARTY_TYPE_ID_SUCCESS:
      return {
        ...state,
        editData: action.payload,
      };

    case actionType.UPDATE_PARTY_TYPE_ID_SUCCESS:
      return {
        ...state,
        updateMessage: action.payload,
      };


    default:
      return state
  }
}

export default PartyTypeReducer