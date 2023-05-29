import { 
  CHANGE_PASSWORD_SUCCESS,

  } from "./actionType";

const INIT_STATE = {
  postMsg: { Status: false },
}

const ChangePasswordReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    // post
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
      }

    default:
      return state
  }
}

export default GroupReducer