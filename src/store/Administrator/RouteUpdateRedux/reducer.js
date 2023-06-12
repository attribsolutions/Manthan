import { POST_ROUTE_UPDATE, POST_ROUTE_UPDATE_SUCCESS, ROUTE_UPDATE_LIST_SUCCESS } from "./actionType"

const INIT_STATE = {
    RouteUpdateList: [],
    postMsg: { Status: false },
    saveBtnloading: false,
}

const RouteUpdateReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ROUTE_UPDATE_LIST_SUCCESS:
            return {
                ...state,
                RouteUpdateList: action.payload,
            }
        case POST_ROUTE_UPDATE:
            return {
                ...state,
                saveBtnloading: true,
            }

        case POST_ROUTE_UPDATE_SUCCESS:
            return {
                ...state,
                postMsg: action.payload,
                saveBtnloading: false,
            }

        default:
            return state
    }
}

export default RouteUpdateReducer  