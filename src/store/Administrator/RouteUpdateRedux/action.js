import {
    POST_ROUTE_UPDATE,
    POST_ROUTE_UPDATE_SUCCESS,
    ROUTE_UPDATE_LIST,
    ROUTE_UPDATE_LIST_SUCCESS
} from "./actionType";

// RouteUpdateList API Using Post Method
export const RouteUpdateListAPI = (data) => ({
    type: ROUTE_UPDATE_LIST,
    data,
});

export const RouteUpdateListSuccess = (data) => ({
    type: ROUTE_UPDATE_LIST_SUCCESS,
    payload: data,
});

export const Post_RouteUpdate = (data) => ({
    type: POST_ROUTE_UPDATE,
    data,
});

export const Post_RouteUpdateSuccess = (data) => ({
    type: POST_ROUTE_UPDATE_SUCCESS,
    payload: data,
});
