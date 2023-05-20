import {
  CHALLAN_POST_API,
  CHALLAN_POST_API_SUCCESS,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  CHALLAN_LIST_FOR_LIST_PAGE,
  CHALLAN_LIST_FOR_LIST_PAGE_SUCCESS,
  GO_BUTTON_CHALLAN_POST_API,
  GO_BUTTON_CHALLAN_POST_API_SUCCESS,
  ITEM_DROPDOWN_CHALLAN,
  MAKE_CHALLAN_ACTION,
  MAKE_CHALLAN_ACTION_SUCCESS,
  ITEM_DROPDOWN_CHALLAN_SUCCESS,
} from './actionType'



//get listpage api
export const challanList_ForListPage = (filters) => ({
  type: CHALLAN_LIST_FOR_LIST_PAGE,
  filters,
});

export const challanList_ForListPageSuccess = (data) => ({
  type: CHALLAN_LIST_FOR_LIST_PAGE_SUCCESS,
  payload: data,
});


export const makeChallanAction = (config={}) => ({
  type: MAKE_CHALLAN_ACTION,
  config,
});

export const makeChallanActionSuccess = (data) => ({
  type: MAKE_CHALLAN_ACTION_SUCCESS,
  payload: data,
});

export const saveChallan_ChallanAdd = ( data) => ({
  type: CHALLAN_POST_API,
  data
});

export const saveChallan_ChallanAddSuccess = (data) => ({
  type: CHALLAN_POST_API_SUCCESS,
  payload: data,
});


export const GoButtonForChallanAdd = ( data) => ({
  type: GO_BUTTON_CHALLAN_POST_API,
  data
});

export const GoButtonForChallanAddSuccess = (data) => ({
  type: GO_BUTTON_CHALLAN_POST_API_SUCCESS,
  payload: data,
});

export const challanItemForDropdown = (data) => ({
  type: ITEM_DROPDOWN_CHALLAN,
   data
});

export const challanItemForDropdownSuccess = (data) => ({
  type: ITEM_DROPDOWN_CHALLAN_SUCCESS,
  payload: data,
});


export const deleteChallanId = (id) => ({
  type: DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  id,
});
export const deleteChallanIdSuccess = (data) => ({
  type: DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  payload: data,
});



