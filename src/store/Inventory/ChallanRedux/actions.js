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
  VDC_ITEM,
  VDC_ITEM_SUCCESS,
  VDC_ITEM_DETAILS,
  VDC_ITEM_DETAILS_SUCCESS,
  IB_INVOICE_API_ERROR_ACTION,
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


export const makeChallanAction = (config = {}) => ({
  type: MAKE_CHALLAN_ACTION,
  config,
});

export const makeChallanActionSuccess = (data) => ({
  type: MAKE_CHALLAN_ACTION_SUCCESS,
  payload: data,
});

export const saveChallan_ChallanAdd = (data) => ({
  type: CHALLAN_POST_API,
  data
});

export const saveChallan_ChallanAddSuccess = (data) => ({
  type: CHALLAN_POST_API_SUCCESS,
  payload: data,
});


export const GoButtonForChallanAdd = (data) => ({
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


export const deleteChallanId = (config = {}) => ({
  type: DELETE_CHALLAN_FOR_CHALLAN_PAGE,
  config,
});

export const deleteChallanIdSuccess = (data) => ({
  type: DELETE_CHALLAN_FOR_CHALLAN_PAGE_SUCCESS,
  payload: data,
});


export const VDC_Item = (config = {}) => ({
  type: VDC_ITEM,
  config,
});

export const VDC_Item_Success = (data) => ({
  type: VDC_ITEM_SUCCESS,
  payload: data,
});



export const VDC_Item_Details = (config = {}) => ({
  type: VDC_ITEM_DETAILS,
  config,
});

export const VDC_Item_Details_Success = (data) => ({
  type: VDC_ITEM_DETAILS_SUCCESS,
  payload: data,
});


export const IB_Invoice_Error_Action = (data) => ({
  type: IB_INVOICE_API_ERROR_ACTION,
  payload: data,
});



