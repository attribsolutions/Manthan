import {
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    TERMS_AND_CONDITIONS_API_ERROR_ACTION
} from "./actionTypes";


export const getTermAndCondition = () => ({         // get List Action
    type: GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
});

export const getTermAndCondition_Success = (data) => ({   // get List success
    type: GET_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: data,
});


export const saveTermAndCondition = (config={}) => ({    // save Action
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API,
    config,

});
export const saveTermAndConditionSuccess = (resp) => ({        // Save  success
    type: POST_METHOD_HANDLER_FOR_TERMSANDCONDITIONS_MASTER_API_SUCCESS,
    payload: resp,
});

export const EditTermsAndCondtions = (config = {}) => ({         // Edit Action 
    type: EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    config
});

export const EditTermsAndCondtions_Success = (editData) => ({     // Edit  Success
    type: EDIT_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: editData,
});

export const UpdateTermsAndCondtions = (config = {}) => ({        // update  Action
    type: UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    config ,
});

export const UpdateTermsAndCondtions_Success = (updateMessage) => ({       //Update Success
    type: UPDATE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload:updateMessage
});

export const DeleteTermsAndCondtions = (config = {}) => ({        // Delete  Action
    type: DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API,
    config,
});

export const DeleteTermsAndCondtions_Success = (resp) => ({        // Delete Success
    type: DELETE_METHOD_FOR_TERMSANDCONDITIONSLIST_API_SUCCESS,
    payload: resp,
});


export const TermsAndConditionsApiErrorAction = () => ({
    type: TERMS_AND_CONDITIONS_API_ERROR_ACTION,
  })