import { POST_ROUTE_UPDATE, POST_ROUTE_UPDATE_SUCCESS, ROUTE_UPDATE_API_ERROR_ACTION, ROUTE_UPDATE_LIST, ROUTE_UPDATE_LIST_SUCCESS } from "./actionType"

const INIT_STATE = {
    RouteUpdateList: [],
    postMsg: { Status: false },
    saveBtnloading: false,
    loading: false,
}

const RouteUpdateReducer = (state = INIT_STATE, action) => {
    switch (action.type) {

        case ROUTE_UPDATE_LIST:
            return {
                ...state,
                loading: true,
            }

        case ROUTE_UPDATE_LIST_SUCCESS:
            return {
                ...state,
                RouteUpdateList: action.payload,
                loading: false,
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

        case ROUTE_UPDATE_API_ERROR_ACTION:
            return {
                ...state,
                saveBtnloading: false,
                loading: false,
            };

        default:
            return state
    }
}

export default RouteUpdateReducer  