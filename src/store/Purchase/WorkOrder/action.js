import { GET_BOM_LIST, GET_BOM_LIST_SUCCESS } from "./actionTypes";

// get BOMList 
export const getBOMList = () => ({
    type: GET_BOM_LIST,
});

export const getBOMListSuccess = (pages) => ({
    type: GET_BOM_LIST_SUCCESS,
    payload: pages,
});
