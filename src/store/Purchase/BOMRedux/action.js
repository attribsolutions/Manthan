import { GET_ITEM_UNITS_DROPDOWN_API, GET_ITEM_UNITS_DROPDOWN_API_SUCCESS, POST_BOM, POST_BOM_SUCCESS } from "./actionTypes";

// post api
export const postBOM = (data) => ({
    type: POST_BOM,
    data,
});

export const postBOMSuccess = (data) => ({
    type: POST_BOM_SUCCESS,
    payload: data,
});

// Get Item Units
export const GetItemUnitsDrodownAPI = (data) => ({
    type: GET_ITEM_UNITS_DROPDOWN_API,
    data,
   
  });
  export const GetItemUnitsDrodownAPISuccess = (data) => ({
    type: GET_ITEM_UNITS_DROPDOWN_API_SUCCESS,
    payload:data,
  });