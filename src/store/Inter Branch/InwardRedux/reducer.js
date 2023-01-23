import { GET_INWARD_LIST_PAGE_SUCCESS, POST_INWARD_SUCCESS } from "./actionType"

const INIT_STATE = {
    postMsg: { Status: false },
    InwardList:[]
}

const InwardReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case POST_INWARD_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
            }

            case GET_INWARD_LIST_PAGE_SUCCESS:
            return {
                ...state,
                InwardList: action.payload,
            }
        default:
            return state
    }
}

export default InwardReducer