import {
    POST_ROUTE_UPDATE,
    POST_ROUTE_UPDATE_SUCCESS,
    ROUTE_UPDATE_API_ERROR_ACTION,
    ROUTE_UPDATE_LIST,
    ROUTE_UPDATE_LIST_SUCCESS
} from "./actionType";

// RouteUpdateList API Using Post Method
export const RouteUpdateListAPI = (config = {}) => ({
    type: ROUTE_UPDATE_LIST,
    config,
});

export const RouteUpdateListSuccess = (resp) => ({
    type: ROUTE_UPDATE_LIST_SUCCESS,
    payload: resp,
});

export const Post_RouteUpdate = (config = {}) => ({
    type: POST_ROUTE_UPDATE,
    config,
});

export const Post_RouteUpdateSuccess = (resp) => ({
    type: POST_ROUTE_UPDATE_SUCCESS,
    payload: resp,
});

export const RouteUpdateApiErrorAction = () => ({
    type: ROUTE_UPDATE_API_ERROR_ACTION,
})
