import {
  POST_MODULES_SUBMIT_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  demo: { Status: false },
}

const RoleAccessReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case POST_MODULES_SUBMIT_SUCCESS:
      return {
        ...state,
        demo: action.payload,
      }
    default:
      return state
  }

}

export default RoleAccessReducer