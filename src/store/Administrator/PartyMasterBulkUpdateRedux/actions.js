import {
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_DROPDOWN,
    POST_PARTY_DROPDOWN_SUCCESS,
    POST_SELECT_FIELD_DROPDOWN,
    POST_SELECT_FIELD_SUCCESS,
  } from './actionTypes'
  
  export const GoButton_For_Party_Master_Bulk_Update_Add = (jsonBody) => ({
    type: GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE,
    jsonBody,
  });
  
  export const GoButton_For_Party_Master_Bulk_Update_AddSuccess = (data) => ({
    type: GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    payload: data,
  });
  
  export const postParty_Master_Bulk_Update = (config={}) => ({
    type: POST_PARTY_MASTER_BULK_UPDATE_PAGE,
    config,
  });
  
  export const postParty_Master_Bulk_Update_Success = (resp) => ({
    type: POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    payload: resp
  });
  
  export const postParty_for_dropdown = () => ({  // post api for Party Dropdown
    type: POST_PARTY_DROPDOWN,
  });
  
  export const postParty_for_dropdown_Success = (resp) => ({ // post Success
    type: POST_PARTY_DROPDOWN_SUCCESS,
    payload: resp,
  });
  
  export const postSelect_Field_for_dropdown = (jsonBody) => ({  // post api for SelectField Dropdown
    type: POST_SELECT_FIELD_DROPDOWN,
    jsonBody,
  });
  
  export const postSelect_Field_for_dropdown_Success = (resp) => ({ // post Success
    type: POST_SELECT_FIELD_SUCCESS,
    payload: resp,
  });