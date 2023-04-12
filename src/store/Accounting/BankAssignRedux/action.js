import {
    SAVE_BANK_ASSIGN,
    SAVE_BANK_ASSIGN_SUCCESS,
    PARTY_BANK_FILTER,
    PARTY_BANK_FILTER_SUCCESS
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