import { 
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD
  } from "./actionType";

const INIT_STATE = {
  loading:false,
  postMsg: { Status: false },
}

const ChangePasswordReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case CHANGE_PASSWORD:
      return {
        ...state,
        loading:true 
      }
    // post
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        postMsg: action.payload,
        loading:false 

      }

    default:
      return state
  }
}

export default ChangePasswordReducer;