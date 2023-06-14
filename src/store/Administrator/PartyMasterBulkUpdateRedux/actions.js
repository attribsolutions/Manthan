import {
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    GO_BUTTON_FOR_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE_SUCCESS,
    POST_PARTY_MASTER_BULK_UPDATE_PAGE,
    POST_SELECT_FIELD_DROPDOWN,
    POST_SELECT_FIELD_SUCCESS,
    POST_PARTY_NAME_DROPDOWN,
    POST_PARTY_NAME_SUCCESS,
    UPDATE_PARTY_MASTER_BULK,
    UPDATE_PARTY_MASTER_BULK_SUCCESS,
    PARTYBULK_API_ERROR_ACTION,
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
  
  export const postSelect_Field_for_dropdown = (jsonBody) => ({  // post api for SelectField Dropdown
    type: POST_SELECT_FIELD_DROPDOWN,
    jsonBody,
  });
  
  export const postSelect_Field_for_dropdown_Success = (resp) => ({ // post Success
    type: POST_SELECT_FIELD_SUCCESS,
    payload: resp,
  });

  export const postPartyName_for_dropdown = (jsonBody) => ({  // post api for PartyName Dropdown
    type: POST_PARTY_NAME_DROPDOWN,
    jsonBody,
  });
  
  export const postPartyName_for_dropdown_Success = (resp) => ({ // post Success
    type: POST_PARTY_NAME_SUCCESS,
    payload: resp,
  });

  export const updatePartyMasterBulkID = (updateData, id) => ({
    type: UPDATE_PARTY_MASTER_BULK,
    updateData, id,
  })
  export const updatePartyMasterBulkIDSuccess = (data) => ({
    type: UPDATE_PARTY_MASTER_BULK_SUCCESS,
    payload: data,
  })

  export const PartyBulkApiErrorAction = () => ({
    type: PARTYBULK_API_ERROR_ACTION,
  })
  