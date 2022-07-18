import {
  PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST_SUCCESS,
} from "./actionType"

const INIT_STATE = {
  PageMasterListForRoleAccess: [],
}

const RoleAccessReducer = (state = INIT_STATE, action) => {
  switch (action.type) {

    case PAGE_MASTER_ACCESS_FOR_ROLE_ACCESS_lIST_SUCCESS:
      return {
        ...state,
        PageMasterListForRoleAccess: action.payload,
      }
    default:
      return state
  }

}

export default RoleAccessReducer