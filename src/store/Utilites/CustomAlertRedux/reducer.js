import {  ALERT_STATE} from "./actionType"
 const INIT_STATE={
  customAlert:{Status:false},
 }
const AlertReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case ALERT_STATE:
      return {
        ...state,
        customAlert: action.payload,
      }
    default:
      return state
  }
}

export default AlertReducer;