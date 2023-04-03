import { SAVE_MANAGEMENT_PARTIES_SUCCESS } from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
}

const ManagementPartiesReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        // post
        case SAVE_MANAGEMENT_PARTIES_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }
     
        default:
            return state
    }
}

export default ManagementPartiesReducer