import {
    POST_METHOD_FOR_PARTYSUBPARTY_API_SUCCESS,
  } from "./actionType";

  const INIT_STATE = {
    PostDataMessage: { Status: false },
  }

  const PartySubPartyReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case POST_METHOD_FOR_PARTYSUBPARTY_API_SUCCESS:
        return {
          ...state,
          PostDataMessage: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default PartySubPartyReducer