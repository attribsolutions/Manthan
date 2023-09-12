import {
  DELETE_DISCOUNT_ID,
  DELETE_DISCOUNT_ID_SUCCESS,
  DISCOUNT_API_ERROR_ACTION,
  EDIT_DISCOUNT_ID,
  EDIT_DISCOUNT_ID_SUCCESS,
  GET_DISCOUNT_LIST,
  GET_DISCOUNT_LIST_SUCCESS,
  SAVE_DISCOUNT_SUBMIT,
  SAVE_DISCOUNT_SUBMIT_SUCCESS,
  UPDATE_DISCOUNT_ID,
  UPDATE_DISCOUNT_ID_SUCCESS,
  GO_BUTTON_DISCOUNT_ACTION,
  GO_BUTTON_DISCOUNT_ACTION_SUCCESS,
  DISCOUNT_PARTY_TYPE_DROPDOWN_ACTION,
  DISCOUNT_PARTY_TYPE_DROPDOWN_SUCCESS,
  DISCOUNT_CUSTOMER_DROPDOWN_ACTION,
  DISCOUNT_CUSTOMER_DROPDOWN_SUCCESS
} from "./actionType";

export const goBtnDiscountAddAction = (config) => ({
  type: GO_BUTTON_DISCOUNT_ACTION,
  config
});
export const goBtnDiscountAddActionSuccess = (resp) => ({
  type: GO_BUTTON_DISCOUNT_ACTION_SUCCESS,
  payload: resp,
})

export const getDiscountList = (filterBody) => ({ // get List Action
  type: GET_DISCOUNT_LIST,
  filterBody
});

export const getDiscountListSuccess = (resp) => ({  // get List success
  type: GET_DISCOUNT_LIST_SUCCESS,
  payload: resp,
});

export const saveDiscountAction = (config = {}) => ({  // save Action
  type: SAVE_DISCOUNT_SUBMIT,
  config,
});

export const saveDiscountActionSuccess = (resp) => ({ // Save  success
  type: SAVE_DISCOUNT_SUBMIT_SUCCESS,
  payload: resp,
});

export const editDiscountID = (config = {}) => ({  // Edit Action 
  type: EDIT_DISCOUNT_ID,
  config,
});

export const editDiscountIDSuccess = (editData) => ({  // Edit  Success
  type: EDIT_DISCOUNT_ID_SUCCESS,
  payload: editData,
});

export const updateDiscountID = (config = {}) => ({   // update  Action
  type: UPDATE_DISCOUNT_ID,
  config,
});
export const updateDiscountIDSuccess = (resp) => ({    //Update Success
  type: UPDATE_DISCOUNT_ID_SUCCESS,
  payload: resp,
});

export const deleteDiscount_ID = (config = {}) => ({  // Delete  Action
  type: DELETE_DISCOUNT_ID,
  config,
});
export const deleteDiscountIDSuccess = (resp) => ({  // Delete Success
  type: DELETE_DISCOUNT_ID_SUCCESS,
  payload: resp,
});

//Discount PartyType drodown API
export const DiscountPartyType_Dropdown_Action = (PartyID) => ({  // DiscountPartyType  Action
  type: DISCOUNT_PARTY_TYPE_DROPDOWN_ACTION,
  PartyID,
});
export const DiscountPartyType_Dropdown_Success = (resp) => ({  // DiscountPartyType Success
  type: DISCOUNT_PARTY_TYPE_DROPDOWN_SUCCESS,
  payload: resp,
});

//DiscountCustomer drodown API
export const DiscountCustomer_Dropdown_Action = (config = {}) => ({  // DiscountCustomer  Action
  type: DISCOUNT_CUSTOMER_DROPDOWN_ACTION,
  config,
});
export const DiscountCustomer_Dropdown_Success = (resp) => ({  // DiscountCustomer Success
  type: DISCOUNT_CUSTOMER_DROPDOWN_SUCCESS,
  payload: resp,
});

export const discountApiErrorAction = () => ({
  type: DISCOUNT_API_ERROR_ACTION,
})

