import {
  SAVE_BANK_ASSIGN,
  SAVE_BANK_ASSIGN_SUCCESS,
  PARTY_BANK_FILTER,
  PARTY_BANK_FILTER_SUCCESS,
  EDIT_BANK_ASSIGN_ID,
  EDIT_BANK_ASSIGN_ID_SUCCESS,
  UPDATE_BANK_ASSIGN_ID,
  UPDATE_BANK_ASSIGN_ID_SUCCESS,
  BANK_ASSIGN_API_ERROR_ACTION
} from "./actionType";


export const saveBankAssign = (config = {}) => ({// save Action
  type: SAVE_BANK_ASSIGN,
  config,
});

export const saveBankAssign_Success = (resp) => ({// Save  success
  type: SAVE_BANK_ASSIGN_SUCCESS,
  payload: resp,
});

export const PartyBankfilter = filters => ({
  type: PARTY_BANK_FILTER,
  payload: filters,
})

export const PartyBankfilterSuccess = filters => ({
  type: PARTY_BANK_FILTER_SUCCESS,
  payload: filters,
})

export const editBankAssignID = (config = {}) => ({ // Edit Action 
  type: EDIT_BANK_ASSIGN_ID,
  config,
});

export const editBankAssignIDSuccess = (editData) => ({// Edit  Success
  type: EDIT_BANK_ASSIGN_ID_SUCCESS,
  payload: editData,
});

export const updateBankAssignID = (config = {}) => ({// update  Action
  type: UPDATE_BANK_ASSIGN_ID,
  config,
});

export const updateBankAssignIDSuccess = (resp) => ({ //Update Success
  type: UPDATE_BANK_ASSIGN_ID_SUCCESS,
  payload: resp,
})

export const BankAssignApiErrorAction = () => ({
  type: BANK_ASSIGN_API_ERROR_ACTION,
})