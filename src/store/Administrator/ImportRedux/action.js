import {
    DELETE_IMPORT_FIELD_ID,
    DELETE_IMPORT_FIELD_ID_SUCCESS,
    EDIT_IMPORT_FIELD_ID,
    EDIT_IMPORT_FIELD_ID_SUCCESS,
    GET_IMPORT_FIELD_LIST,
    GET_IMPORT_FIELD_LIST_SUCCESS,
    GET_CONTROLTYPE_DROPDOWN,
    GET_CONTROLTYPE_DROPDOWN_SUCCESS,
    GET_VALIDATIONTYPE_DROPDOWN,
    GET_VALIDATIONTYPE_DROPDOWN_SUCCESS,
    POST_IMPORT_FIELD,
    POST_IMPORT_FIELD_SUCCESS,
    UPDATE_IMPORT_FIELD_ID,
    UPDATE_IMPORT_FIELD_ID_SUCCESS
  } from "./actionType";
  
  
  export const getImportFieldList = () => ({ // get List Action
    type: GET_IMPORT_FIELD_LIST,
  });
  
  export const getImportFieldListSuccess = (ImportFieldList) => ({  // get List success
    type: GET_IMPORT_FIELD_LIST_SUCCESS,
    payload: ImportFieldList,
  });
  
  export const saveImportField = (config={}) => ({  // save Action
    type: POST_IMPORT_FIELD,
    config,
  });
  
  export const saveImportField_Success = (resp) => ({ // Save  success
    type: POST_IMPORT_FIELD_SUCCESS,
    payload: resp,
  });
  
  export const editImportFieldID = (config = {}) => ({  // Edit Action 
    type: EDIT_IMPORT_FIELD_ID,
    config ,
  });
  export const editImportFieldIDSuccess = (editData) => ({  // Edit  Success
    type: EDIT_IMPORT_FIELD_ID_SUCCESS,
    payload: editData,
  });
  
  export const updateImportFieldID = (config = {}) => ({   // update  Action
    type: UPDATE_IMPORT_FIELD_ID,
    config, 
  });
  export const updateImportFieldIDSuccess = (resp) => ({    //Update Success
    type: UPDATE_IMPORT_FIELD_ID_SUCCESS,
    payload: resp,
  });
  
  export const getControlType = () => ({    
    type: GET_CONTROLTYPE_DROPDOWN,
  });
  export const getControlTypeSuccess = (ControlType) => ({  
    type: GET_CONTROLTYPE_DROPDOWN_SUCCESS,
    payload:ControlType,
  });

  export const getValidationType = () => ({     
    type: GET_VALIDATIONTYPE_DROPDOWN,
  });
  export const getValidationTypeSuccess = (ValidationType) => ({  
    type: GET_VALIDATIONTYPE_DROPDOWN_SUCCESS,
    payload: ValidationType,
  });
  
  export const deleteImportField_ID = (config={}) => ({  // Delete  Action
    type: DELETE_IMPORT_FIELD_ID,
    config,
  });
  export const deleteImportFieldIDSuccess = (resp) => ({  // Delete Success
    type:DELETE_IMPORT_FIELD_ID_SUCCESS,
    payload: resp,
  });