import {
    SAVE_BANK_MASTER,
    SAVE_BANK_MASTER_SUCCESS,
    DELETE_BANK_ID,
    DELETE_BANK_ID_SUCCESS,
    EDIT_BANK_ID,
    EDIT_BANK_ID_SUCCESS,
    GET_BANK_LIST,
    GET_BANK_LIST_SUCCESS,
    UPDATE_BANK_ID,
    UPDATE_BANK_ID_SUCCESS
  } from "./actionType";
  

  export const getBanklist = () => ({// get List Action
    type: GET_BANK_LIST,
  });
  
  export const getBanklistSuccess = companyId => ({// get List success
    type: GET_BANK_LIST_SUCCESS,
    payload: companyId,
  });
  
  export const saveBankMaster = (config = {}) => ({// save Action
    type: SAVE_BANK_MASTER,
    config,
  });
  
  export const saveBankMaster_Success = (resp) => ({// Save  success
    type: SAVE_BANK_MASTER_SUCCESS,
    payload: resp,
  });
  
  export const editBankID = (config = {}) => ({ // Edit Action 
    type: EDIT_BANK_ID,
    config,
  });
  
  export const editBankIDSuccess = (editData) => ({// Edit  Success
    type: EDIT_BANK_ID_SUCCESS,
    payload: editData,
  });
  
  export const updateBankID = (config = {}) => ({// update  Action
    type: UPDATE_BANK_ID,
    config,
  });
  
  export const updateBankIDSuccess = (resp) => ({ //Update Success
    type: UPDATE_BANK_ID_SUCCESS,
    payload: resp,
  })
  
  export const delete_Bank_ID = (config={}) => ({// Delete  Action
    type: DELETE_BANK_ID,
    config,
  });
  
  export const deleteBankIDSuccess = (resp) => ({// Delete Success
    type: DELETE_BANK_ID_SUCCESS,
    payload: resp
  });
  
  