import { CHALLAN_LIST_FILTERS, GET_CHALLAN_LIST_PAGE, GET_CHALLAN_LIST_PAGE_SUCCESS, INWARD_BUTTON_ID, INWARD_BUTTON_ID_SUCCESS } from "./actionType";

export const Challanlistfilters = filter => ({
    type: CHALLAN_LIST_FILTERS,
    payload: filter,
  })
  
//Challan listpage api
export const getChallanListPage = (filters) => ({
    type: GET_CHALLAN_LIST_PAGE,
    filters,
  });
  
  export const getChallanListPageSuccess = (data) => ({
    type: GET_CHALLAN_LIST_PAGE_SUCCESS,
    payload: data,
  });
  
    //Inward Button api
    export const InwardButtonId =(id)=>({
      type:INWARD_BUTTON_ID,
      id
    })
    export const InwardButtonIdSuccess =(editData)=>({
      type:INWARD_BUTTON_ID_SUCCESS,
     payload:editData,
    })