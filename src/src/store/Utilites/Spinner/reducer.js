import {  SPINNER_STATE } from "./actionType"
 const INIT_STATE={
  SpinnerState:false,
 }
const SpinnerReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case SPINNER_STATE:
      return {
        ...state,
        SpinnerState: action.payload,
      }
    
    default:
      return state
  }
}

export default SpinnerReducer;