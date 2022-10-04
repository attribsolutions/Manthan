import {
    GET_GROUP_TYPES_LIST,
    GET_GROUP_TYPES_LIST_SUCCESS
} from "./actionType";

// get GroupTypes list 
export const getGroupTypeslist = () => ({
    type: GET_GROUP_TYPES_LIST,
});

export const getGroupTypeslistSuccess = (pages) => ({
    type: GET_GROUP_TYPES_LIST_SUCCESS,
    payload: pages,
});